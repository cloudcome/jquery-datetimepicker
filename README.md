# jquery-datetimepicker [![spm version](http://spmjs.io/badge/jquery-datetimepicker)](http://spmjs.io/package/jquery-datetimepicker)

AUTHOR WEBSITE: [http://ydr.me/](http://ydr.me/)

jquery.fn.datetimepicker 日期时间选择器

**五星提示：当前脚本未作优化、未完工，请勿用在生产环境**

__IT IS [A SPM PACKAGE](http://spmjs.io/package/jquery-datetimepicker).__




#USAGE
```
var $ = require('jquery');
require('jquery-datetimepicker')($);
```



#OPTIONS
```
$.fn.datetimepicker.defaults = {
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
```
