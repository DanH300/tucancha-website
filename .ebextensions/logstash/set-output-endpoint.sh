#!/bin/bash

sed -i "s/host.*/host => \"${GRAYLOG_HOST}\"/" /emind/ebextensions/logstash/*output*.conf

