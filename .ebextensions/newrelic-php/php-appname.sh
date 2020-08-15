#!/bin/bash

AWS_INFO_SERVICE="http://169.254.169.254/"
AWS_INSTANCE_IDENTITY_URL="${AWS_INFO_SERVICE}latest/dynamic/instance-identity/document"

CURRENT_INSTANCE_ID=""
CURRENT_INSTANCE_REGION=""
CURRENT_INSTANCE_NAME=""

SCRIPT_NAME=$(basename $0)

JQ_PATH="/usr/bin/jq"

function write_log ()
{
    logger -t "${SCRIPT_NAME}" "pid=$$ Msg=$*"
}

function remove_quotes()
{
    if [ -z $1 ]; then
        x=""
    else
        x="${1#\"}"
        x="${x%\"}"
    fi

    echo $x
}

#Check if script is run on an Amazon EC2 instance
function running_on_ec2_instance()
{
    x=$(curl -s $AWS_INFO_SERVICE)
    if [ $? -gt 0 ]; then
        write_log "[ERROR] Command not valid outside an Amazon EC2 instance."
        exit 1
    fi
}

#Check the existance of the JSONQuery prerequisite
function check_jq_prerequisite()
{
    if [ -x "${JQ_PATH}" ]; then
        write_log "[INFO] JQ exists and is executable: ${JQ_PATH}"
		result=0
    else
        exec_file=$(which jq 2>/dev/null)
        result=$?
        if [ $result -ne 0 ]; then
            write_log "[ERROR] \"jq\" prerequisite was not found. Please install it and add the installation directory to the PATH environment variable. [${exec_file}]"
        elif [ -z $exec_file ]; then
            write_log "[ERROR] \"jq\" prerequisite was not found. Please install it and add the installation directory to the PATH environment variable."
            result=1
		else
		    JQ_PATH=$exec_file
			write_log "[INFO] JQ executable found at path ${JQ_PATH}"
        fi
	fi

    echo $result
}

#Try to download jq utility
function get_jq_prerequisite()
{
    write_log "Trying to download the 'jq' prerequisite ...'"
    jq_link="http://stedolan.github.io/jq/download/linux64/jq"
    wget "${jq_link}" -O "${JQ_PATH}" >/dev/null 2>&1
    result=$?
    if [ $result -eq 0 ]; then
        chmod 755 "${JQ_PATH}"
        echo '{"a": "b"}' | $JQ_PATH '.' >/dev/null 2>&1
        result=$?
        if [ $result -gt 0 ]; then
            rm -f "${JQ_PATH}"
        fi
    fi 
    if [ $result -gt 0 ]; then
        write_log "Download of the 'jq' prerequisite was not successful."
    else
        write_log "The 'jq' prerequisite has been successfully downloaded [${JQ_PATH}]"
    fi
    echo $result
}

#Get the ID of the current EC2 instance
function get_iid_of_current_instance()
{
    CURRENT_INSTANCE_ID=$(curl -s $AWS_INSTANCE_IDENTITY_URL | $JQ_PATH '.instanceId')
    if [ $? -gt 0 ]; then
        write_log "[ERROR] Unable to get the ID for the current EC2 instance."
        exit 1
    fi

    if [ -z $CURRENT_INSTANCE_ID ]; then
        write_log "[ERROR] Invalid ID for the current EC2 instance."
        exit 1
    fi

    CURRENT_INSTANCE_ID=$(remove_quotes $CURRENT_INSTANCE_ID)
    write_log "[INFO] Current instance ID: ${CURRENT_INSTANCE_ID}"
}

#Get the region of the current EC2 instance
function get_region_of_current_instance()
{
    CURRENT_INSTANCE_REGION=$(curl -s $AWS_INSTANCE_IDENTITY_URL | $JQ_PATH '.region')
    if [ $? -gt 0 ]; then
	    write_log "[ERROR] Unable to get the region for the current EC2 instance."
        exit 1
    fi

    if [ -z $CURRENT_INSTANCE_REGION ]; then
        write_log "[ERROR] Invalid region for the current EC2 instance."
        exit 1
    fi

    #Remove prefix and suffix "
    CURRENT_INSTANCE_REGION="$(remove_quotes $CURRENT_INSTANCE_REGION)"

    write_log "[INFO] Current instance region: ${CURRENT_INSTANCE_REGION}"
}

function get_ec2_tags()
{
    if [ -z "$2" ]; then
        TAGS="$(/usr/bin/aws --region $1 ec2 describe-tags)"
    else
        TAGS="$(/usr/bin/aws --profile $2 --region $1 ec2 describe-tags)"
    fi

    if [ $? -gt 0 ]; then
        write_log "[ERROR] Execution of AWS CLI tool failed. Check if all required configuration params are available."
        exit 3
    fi

    echo "$TAGS"
}

function get_current_instance_name_tag()
{
    NAME=`echo "$1" | $JQ_PATH ".Tags[] | select(.ResourceId == \"$2\") | select(.Key == \"Name\") | .Value"`

    if [ $? -gt 0 ]; then
        write_log "[ERROR] Unable to parse AWS CLI Tool output."
        exit 3
    fi

    if [ -z "$NAME" ]; then
        write_log "[ERROR] Instance name not found."
        exit 3
    fi

    NAME="$(remove_quotes $NAME)"

    echo $NAME
}

function get_application_name()
{
    app_name="Undefined"
	
	write_log "[INFO] Looking for the application name ..."
	
	running_on_ec2_instance
    result=$?
    if [ $result -eq 0 ]; then
        result=$(check_jq_prerequisite)
        if [ $result -gt 0 ]; then
            #Try to download it and re-test
            result=$(get_jq_prerequisite)
            if [ $result -eq 0 ]; then
                #Re-test
                result=$(check_jq_prerequisite)
            fi
        fi	
    fi

    if [ $result -eq 0 ]; then
        get_iid_of_current_instance
        result=$?
    fi

    if [ $result -eq 0 ]; then
        get_region_of_current_instance
	    result=$?
    fi

    if [ $result -eq 0 ]; then
        TAGS=$(get_ec2_tags $CURRENT_INSTANCE_REGION $CONFIG_PROFILE)
        result=$?
    fi

    if [ $result -eq 0 ]; then
        app_name=$(get_current_instance_name_tag "$TAGS" "$CURRENT_INSTANCE_ID")
    fi
	
	write_log "[INFO] Application name: ${app_name}"
	
	echo "$app_name"
}

APPLICATION_NAME=$(get_application_name)

NEWRELIC_INI="/etc/php.d/newrelic.ini"
PHP_SETTING=$(cat "${NEWRELIC_INI}" | grep "^newrelic\.appname")
if [ "x${PHP_SETTING}" == "x" ]; then
    echo "newrelic.appname = \"${APPLICATION_NAME}\"" >> "${NEWRELIC_INI}"
else
    sed -i "s/^newrelic\.appname.*/newrelic\.appname = \"${APPLICATION_NAME}\"/" "${NEWRELIC_INI}"
fi
