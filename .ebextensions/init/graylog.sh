if grep -Fxq "##whist-graylog##" "/etc/httpd/conf/httpd.conf"; then
	echo "nothing to do, allready has graylog"
else
	echo '##whist-graylog##' >> /etc/httpd/conf/httpd.conf
    echo 'LogFormat "{ \"version\": \"1.1\", \"host\": \"%V\", \"short_message\": \"%r\", \"timestamp\": %{%s}t, \"level\": 6, \"_user_agent\": \"%{User-Agent}i\", \"_source_ip\": \"%{X-Forwarded-For}i\", \"_duration_usec\": %D, \"_duration_sec\": %T, \"_request_size_byte\": %O, \"_http_status\": %>s, \"_http_request_path\": \"%U\", \"_http_request\": \"%U%q\", \"_http_method\": \"%m\", \"_http_referer\": \"%{Referer}i\" }" graylog2_access' >> /etc/httpd/conf/httpd.conf
	echo 'CustomLog "|/usr/bin/nc -u 172.16.37.221 12201" graylog2_access' >> /etc/httpd/conf/httpd.conf
	echo '##whist-graylog-end##' >> /etc/httpd/conf/httpd.conf
	/etc/init.d/httpd restart
fi
