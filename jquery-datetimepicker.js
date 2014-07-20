/*!
 * jquery.fn.datepicker
 * @author ydr.me
 * @version 1.0
 */






module.exports = function($){
    "use strict";
    var prefix = "jquery-datepicker____",
        validParts = /y{1,4}|m{1,2}|d{1,2}/ig,
        D = new Date(),
        thisYear = D.getFullYear(),
        thisMonth = D.getMonth(),
        thisDate = D.getDate(),
        defaults = {
            // 语言
            language: {
                yearUnit: "年",
                monthUnit: "月",
                dayUnit: "日",
                weekUnit: "周",
                month: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
                week: ["日", "一", "二", "三", "四", "五", "六"],
                prev: "上一个",
                next: "下一个"
            },
            // 年限
            yearRange: [thisYear - 5, thisYear + 5],
            // 默认年
            year: thisYear,
            // 默认月
            month: thisMonth + 1,
            // 默认日
            date: thisDate,
            // 格式化：年=yyyy，月=M，日=d
            format: "yyyy年M月d日",
            // 动画时间
            duration: 123,
            // 定位
            position: {},
            // 打开回调
            onopen: function() {},
            // 关闭回调
            onclose: function() {},
            // 选择回调
            onchoose: function() {}
        };



    $.fn.datetimepicker = function(settings) {
        return this.each(function() {
            var $input = $(this),
                id = prefix + new Date().getTime(),
                html = "",
                options = $.extend({}, defaults, settings, {
                    // 下拉的年月
                    select: {
                        year: thisYear,
                        month: thisMonth
                    },
                    // 选择的年月日
                    choose: {
                        year: -1,
                        month: -1,
                        date: -1
                    }
                }),
                $datepicker,
                prevClaass = "." + prefix + "prev",
                nextClaass = "." + prefix + "next",
                chooseYearClass = "." + prefix + "year",
                chooseMonthClass = "." + prefix + "month",
                chooseClass = chooseYearClass + "," + chooseMonthClass,
                $choose,
                $chooseYear,
                $chooseMonth,
                $yearList,
                $monthList,
                $tbody;

            // 渲染
            if ($input.data(prefix + "id") === undefined) {
                // 存储参数
                --options.month;
                $input.data(prefix + "id", id);
                $input.data(prefix + "options", options);

                html += '<div id="' + id + '" class="' + prefix + '">';

                html += _createHeader(options);

                html += '<table class="' + prefix + 'table">' + _createThead(options) + '<tbody class="' + prefix + 'tbody">' + _createTbody(options) + '</tbody></table>'

                html += '</div>';

                $(html).appendTo("body");

                $datepicker = $("#" + id);
                $datepicker.data(prefix + "toggle", 0);
                $datepicker.data(prefix + "isOpen", 0);
                // 选择
                $choose = $(chooseClass, $datepicker);
                $chooseYear = $(chooseYearClass, $datepicker);
                $chooseMonth = $(chooseMonthClass, $datepicker);
                $yearList = $("." + prefix + "year-list", $datepicker);
                $monthList = $("." + prefix + "month-list", $datepicker);

                // 表格
                $tbody = $("." + prefix + "tbody", $datepicker);

                // 下拉年份
                $datepicker.on("click", chooseClass, function() {
                    var $this = $(this),
                        $ul = $(this).next("ul"),
                        $a = $("." + prefix + "year,." + prefix + "month"),
                        $list = $("." + prefix + "select-list");

                    $list.fadeOut(options.duration);
                    $choose.removeClass("active");

                    if ($ul.css("display") == "none") {
                        $this.addClass("active");
                        $ul.stop(true, true).fadeIn(options.duration);
                    } else {
                        $ul.stop(true, true).fadeOut(options.duration, function() {
                            $this.removeClass("active");
                        });
                    }
                    return false;
                })
                // 单击年份
                .on("click", chooseYearClass + "-list li", function() {
                    options.select.year = $(this).attr("data-year") * 1;
                    _render();
                })
                // 单击月份
                .on("click", chooseMonthClass + "-list li", function() {
                    options.select.month = $(this).attr("data-month") * 1;
                    _render();
                })
                // 单击上一个月
                .on("click", prevClaass, function() {
                    if (options.select.month == 0) {
                        options.select.month = 11;
                        --options.select.year;
                    } else {
                        --options.select.month;
                    }
                    _render();
                    return false;
                })
                // 单击下一个月
                .on("click", nextClaass, function() {
                    if (options.select.month == 11) {
                        options.select.month = 0;
                        ++options.select.year;
                    } else {
                        ++options.select.month;
                    }
                    _render();
                    return false;
                })
                // 单击日期
                .on("click", "td span", function() {
                    var $td = $(this).parent(),
                        _chooseYear = $td.attr("data-year"),
                        _chooseMonth = $td.attr("data-month"),
                        _chooseDate = $td.attr("data-date");

                    if (options.choose.year == _chooseYear && options.choose.month == _chooseMonth && options.choose.date == _chooseDate) return;

                    // 有选择日期
                    if (_chooseDate) {
                        $input.val(_parseDate(new Date(_chooseYear, _chooseMonth, _chooseDate), options.format)).focus();
                        $datepicker.find("td").removeClass("active");
                        $td.addClass("active");
                        options.choose.year = _chooseYear;
                        options.choose.month = _chooseMonth;
                        options.choose.date = _chooseDate;
                        options.onchoose(_chooseYear, _chooseMonth, _chooseDate);
                        _close($datepicker);
                    }
                });

                $(document).click(function(e) {
                    // 单击输入框 || 单击日期选择器 || 为触发事件 || 已经关闭
                    if (e.target == $input[0] || $(e.target).closest("." + prefix).length || $datepicker.data(prefix + "toggle") || !$datepicker.data(prefix + "isOpen")) return;
                    var $ul = $("." + prefix + "select-list");
                    $ul.fadeOut(options.duration);
                    $choose.removeClass("active");
                    _close($datepicker);
                    return false;
                });

                // 聚焦
                $input.on("focusin click", function() {
                    _open($datepicker);
                    return false;
                });


                /**
                 * 重新渲染
                 * @return {[type]} [description]
                 * @version 1.0
                 * 2013年11月1日13:07:32
                 */

                function _render() {
                    $chooseYear.html(options.select.year + options.language.yearUnit);
                    $chooseMonth.html(options.language.month[options.select.month] + options.language.monthUnit);
                    $tbody.html(_createTbody(options));
                    $choose.removeClass("active");
                    $yearList.fadeOut(options.duration).find("li").filter(function() {
                        return $(this).attr("data-year") == options.select.year;
                    }).addClass("active").siblings().removeClass("active");
                    $monthList.fadeOut(options.duration).find("li").filter(function() {
                        return $(this).attr("data-month") == options.select.month;
                    }).addClass("active").siblings().removeClass("active");
                }
            }

            if (settings === "open") {
                id = $input.data(prefix + "id");
                $datepicker = $("#" + id);
                if (!$datepicker.data(prefix + "isOpen")) {
                    $datepicker.data(prefix + "toggle", 1);
                    _open($datepicker, function() {
                        $datepicker.data(prefix + "toggle", 0);
                    });
                }
            } else if (settings === "close") {
                id = $input.data(prefix + "id");
                $datepicker = $("#" + id);
                _close($datepicker);
            }

            function _open($datepicker, callback) {
                if ($datepicker.data(prefix + "isOpen")) return;

                var offL = $input.offset().left,
                    offT = $input.offset().top,
                    theH = $input.outerHeight(),
                    pos = $.extend({}, {
                        left: offL,
                        top: offT + theH + 7
                    }, options.position);

                $datepicker.data(prefix + "isOpen", 1).css(pos).fadeIn(options.duration, function() {
                    $input.focus();
                    if (callback) callback();
                    options.onopen();
                });
            }

            function _close($datepicker, callback) {
                if (!$datepicker.data(prefix + "isOpen")) return;
                $datepicker.fadeOut(options.duration, function() {
                    options.onclose();
                }).data(prefix + "toggle", 0).data(prefix + "isOpen", 0);
            }
        });
    }



    /**
     * 生成日期选择器的头部
     * @param  {Object} 参数对象
     * @return {String} 生成的html
     * @version 1.0
     * 2013年11月1日13:07:09
     */

    function _createHeader(options) {
        var prevTitle = options.language.prev + options.language.monthUnit,
            nextTitle = options.language.next + options.language.monthUnit,
            yearOptions = _createYearOptions(options),
            monthOptions = _createMonthOptions(options),
            year = options.year + options.language.yearUnit,
            month = options.language.month[options.month] + options.language.monthUnit,
            html = '<div class="' + prefix + 'header"><div class="' + prefix + 'select"><a href="#" class="' + prefix + 'year">' + year + '</a>' + yearOptions + '</div><div class="' + prefix + 'select"><a href="#" class="' + prefix + 'month">' + month + '</a>' + monthOptions + '</div><a href="#" class="' + prefix + 'prev" title="' + prevTitle + '"></a><a href="#" class="' + prefix + 'next" title="' + nextTitle + '"></a></div>';
        return html;
    }


    /**
     * 生成年份选项
     * @param  {Object} 对象
     * @return {String} 生成HTML
     * @version 1.0
     * 2013年11月1日13:06:09
     */

    function _createYearOptions(options) {
        var html = '',
            unit = options.language.yearUnit,
            i = options.yearRange[0],
            j = options.yearRange[1],
            klassArr = [],
            klassStr = "";
        html += '<ul class="list-unstyled ' + prefix + 'select-list ' + prefix + 'year-list">';
        for (; i <= j; i++) {

            klassArr = [];
            klassStr = "";

            // 当前选择年
            if (i == options.year) klassArr.push("active");

            // 当年
            if (i == thisYear) klassArr.push("current");

            if (klassArr.length) klassStr = ' class="' + klassArr.join(" ") + '"';

            html += '<li' + klassStr + ' data-year="' + i + '">' + i + unit + '</li>';
        }
        html += '</ul>';
        return html;
    }



    /**
     * 生成月份选项
     * @param  {Object} 对象
     * @return {String} 生成HTML
     * @version 1.0
     * 2013年11月1日13:06:09
     */

    function _createMonthOptions(options) {
        var html = '',
            unit = options.language.monthUnit,
            month = options.language.month,
            i = 0,
            j = 11,
            klassArr = [],
            klassStr = "";
        html += '<ul class="list-unstyled ' + prefix + 'select-list ' + prefix + 'month-list">';
        for (; i <= j; i++) {
            klassArr = [];
            klassStr = "";

            // 当前选择月
            if (i == options.month) klassArr.push("active");

            // 当月
            if (i == thisMonth) klassArr.push("current");

            if (klassArr.length) klassStr = ' class="' + klassArr.join(" ") + '"';

            html += '<li' + klassStr + ' data-month="' + i + '">' + month[i] + unit + '</li>';
        }
        html += '</ul>';
        return html;
    }


    /**
     * 生成星期表头
     * @param  {Object} 包含星期、星期语言的对象
     * @return {String} 生成的HTML
     * @version 1.0
     * 2013年11月1日13:05:22
     */

    function _createThead(options) {
        var html = '<thead><tr>',
            i = 0,
            j = 6,
            unit = options.language.weekUnit,
            week = options.language.week;
        for (; i <= j; i++) {
            html += '<th>' + unit + week[i] + '</th>';
        }
        html += '</tr></thead>';
        return html;
    }


    /**
     * 生成日期表格
     * @param  {Object} 包含年月日的对象
     * @return {String} 生成的HTML
     * @version 1.0
     * 2013年11月1日13:02:31
     */

    function _createTbody(options) {
        var html = '',
            selectYear = options.select.year,
            selectMonth = options.select.month,
            // 当月第一天星期几
            firstDay = new Date(selectYear, selectMonth, 1).getDay(),
            // 当月日期占位数量=该月天数+第一天星期几
            monthDays = _getDaysInMonth(selectYear, selectMonth) + firstDay,
            // 跨上一年
            isCrossPrevYear = selectMonth == 0,
            // 跨下一年
            isCrossNextYear = selectMonth == 11,
            // 上个月所在的年
            prevMonthYear = isCrossPrevYear ? selectYear - 1 : selectYear,
            // 下个月所在的年
            nextMonthYear = isCrossNextYear ? selectYear + 1 : selectYear,
            // 上个月
            prevMonth = isCrossPrevYear ? 11 : selectMonth - 1,
            // 下个月
            nextMonth = isCrossNextYear ? 0 : selectMonth + 1,
            // 上个月开始日期
            prevMonthDate = _getDaysInMonth(prevMonthYear, prevMonth) - firstDay,
            // 下个月开始日期
            nextMonthDate = 0,
            r = 0,
            m = 0,
            n = 6,
            index = 0,
            num = 0,
            klassArr = [],
            klassStr = '',
            dataYear = 0,
            dataMonth = 0,
            dataDate = 0,
            // 最大行数
            maxRows = Math.ceil(monthDays / 7);

        for (; r < maxRows; r++) {
            html += '<tr>';
            for (m = 0, n = 6; m <= n; m++) {

                num++;
                klassArr = [];
                klassStr = "";

                // 当月中
                if (num > firstDay && num <= monthDays) {
                    dataYear = selectYear;
                    dataMonth = selectMonth;
                    dataDate = ++index;
                }
                // 当月前
                else if (num <= firstDay) {
                    dataYear = prevMonthYear;
                    dataMonth = prevMonth;
                    dataDate = ++prevMonthDate;
                    klassArr.push("old");
                }
                // 当月后
                else {
                    dataYear = nextMonthYear;
                    dataMonth = nextMonth;
                    dataDate = ++nextMonthDate;
                    klassArr.push("new");
                }

                // 当前选择日
                if (options.choose.year == dataYear && options.choose.month == dataMonth && options.choose.date == dataDate) klassArr.push("active");

                // 当前日
                if (thisYear == dataYear && thisMonth == dataMonth && thisDate == dataDate) klassArr.push("current");

                // class
                if (klassArr.length) klassStr = ' class="' + klassArr.join(" ") + '"';

                html += '<td data-year="' + dataYear + '" data-month="' + dataMonth + '" data-date="' + dataDate + '" ' + klassStr + '><span>' + dataDate + '</span></td>';
            }
            html + '</tr>';
        }

        return html;
    }



    /**
     * 获得一个月的天数
     * @param  {Number} 年
     * @param  {Number} 月
     * @return {Number} 天数
     * @version 1.0
     * 2013年11月1日13:04:04
     */

    function _getDaysInMonth(year, month) {
        return [31, (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    }



    function _parseFormat(format) {
        // 参考自：https://github.com/eternicode/bootstrap-datepicker
        // IE treats \0 as a string end in inputs (truncating the value),
        // so it's a bad format delimiter, anyway
        var separators = format.replace(validParts, '\0').split('\0'),
            parts = format.match(validParts);
        if (!separators || !separators.length || !parts || parts.length === 0) {
            throw new Error("Invalid date format.");
        }

        return {
            separators: separators,
            parts: parts
        };
    }

    function _parseDate(DateObj, formatStr) {
        var matches = {
            "y+": DateObj.getFullYear(),
            "m+": DateObj.getMonth() + 1,
            "d+": DateObj.getDate()
        },
            formatObj = _parseFormat(formatStr),
            separators = formatObj.separators,
            parts = formatObj.parts,
            part,
            temp,
            match,
            str = "",
            i, j, reg;

        for (i in parts) {
            temp = parts[i];
            part = parts[i];

            for (j in matches) {
                match = matches[j];
                reg = new RegExp("(" + j + ")", "i");
                if (reg.test(temp)) {
                    temp = temp.replace(RegExp.$1, match);
                    if (j == "y+") {
                        temp = temp.substr(4 - part.length);
                    } else {
                        temp = RegExp.$1.length == 2 && temp < 10 ? "0" + temp : temp;
                    }
                }
            }

            str += separators[i] + temp;
        }
        str += separators.pop();

        return str;
    }


};
