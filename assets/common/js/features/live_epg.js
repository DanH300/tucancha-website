$(document).ready(function () {

    function get_date(date) {

        dat = new Date(parseInt(date));
        var curr_date = dat.getDate();
        var curr_month = dat.getMonth() + 1;
        var curr_year = dat.getFullYear();
        final = curr_date + ' ' + curr_month + ' ' + curr_year;
        return  final;
    }

    function get_hour(date) {
        date = new Date(date);
        hours = date.getHours();
        minutes = date.getMinutes();
        ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    $(document).on('click', '.select_day', function () {

        $('#selectDays td').removeClass('daySelected');
        $('#selectDays td:first').css('background-color', '#E6E6E6');
        $(this).addClass('daySelected');
        selectDate = get_date($(this).attr('item-time'));
        $("#epgTable").html('');
        for (i = 0; i < contentEpg.length; i++) {

            programDate = get_date(contentEpg[i].startTime);

            if (selectDate == programDate) {

                hour = get_hour(contentEpg[i].startTime);
                title_arr = contentEpg[i].program.title.split('|');

                if (country_var == 'Jamaica') {
                    if (title_arr[0] != '') {
                        title = title_arr[0];
                        if (i == 0) {
                            $("#epgTable").append('<tr><td class="epgTime current_epg_date">' + hour.toUpperCase() + '</td><td class="epgData epgDataCurrent" style="border-right:8px solid #7f00bf;"><span>' + title + '</span></td></tr>');
                        } else {
                            $("#epgTable").append('<tr><td class="epgTime">' + hour.toUpperCase() + '</td><td class="epgData"><span>' + title + '</span></td></tr>');
                        }
                    }
                } else {
                    if (typeof contentEpg[i].program.runtime != 'undefined' &&
                            contentEpg[i].program.runtime != 0 && title_arr.length > 1) {
                        title = title_arr[1];
                    } else {
                        title = title_arr[0];
                    }
                    if (i == 0) {
                        $("#epgTable").append('<tr><td class="epgTime current_epg_date">' + hour.toUpperCase() + '</td><td class="epgData epgDataCurrent" style="border-right:8px solid #7f00bf;"><span>' + title + '</span></td></tr>');
                    } else {
                        $("#epgTable").append('<tr><td class="epgTime">' + hour.toUpperCase() + '</td><td class="epgData"><span>' + title + '</span></td></tr>');
                    }
                }
            }

        }

    });
});

