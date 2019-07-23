/**
 * moonRangePicker 月份选择
 * 依赖jquery moment.js 请自行引入
 */
!function () {
    var moonRangePicker = function (element, options, cb) {
        this.parentEl = 'body';
        this.element = $(element);
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.minDate = false;
        this.maxDate = false;
        this.autoApply = true;
        this.autoUpdateInput = true;
        this.ranges = {};
        this.locale = {
            direction: 'ltr',
            format: 'YYYY-MM',
            separator: ' - ',
            applyLabel: '确认',
            cancelLabel: '取消',
            weekLabel: 'W',
            customRangeLabel: 'Custom Range',
            daysOfWeek: moment.weekdaysMin(),
            monthNames: moment.monthsShort(),
            firstDay: moment.localeData().firstDayOfWeek()
        };
        this.callback = function () {
        };
        this.drops = 'down';
        if (this.element.hasClass('dropup'))
            this.drops = 'up';
        this.cbodyHtml = '<div class="cbody">' +
            '<div class="moonBox"><span>1月</span></div>' +
            '<div class="moonBox"><span>2月</span></div>' +
            '<div class="moonBox"><span>3月</span></div>' +
            '<div class="moonBox"><span>4月</span></div>' +
            '<div class="moonBox"><span>5月</span></div>' +
            '<div class="moonBox"><span>6月</span></div>' +
            '<div class="moonBox"><span>7月</span></div>' +
            '<div class="moonBox"><span>8月</span></div>' +
            '<div class="moonBox"><span>9月</span></div>' +
            '<div class="moonBox"><span>10月</span></div>' +
            '<div class="moonBox"><span>11月</span></div>' +
            '<div class="moonBox"><span>12月</span></div>' +
            '</div>';
        this.template =
            '<div class="moonrangepicker moonrangepicker-dropdown dropdown-menu datepicker-orient-left datepicker-orient-bottom">' +
            '<div class="calendar left">' +
            '<div class="header">' +
            '<div class="prev hdBtn">' +
            '<i class="fa fa-chevron-left glyphicon glyphicon-chevron-left"></i>' +
            '</div>' +
            '<div class="yearBox" onselectstart="return false">' + (moment().format('YYYY') - 1) + '</div>' +
            '</div>' +
            this.cbodyHtml +
            '</div>' +
            '<div class="calendar right">' +
            '<div class="header">' +
            '<div class="yearBox" onselectstart="return false">' + moment().format('YYYY') + '</div>' +
            '<div class="next hdBtn">' +
            '<i class="fa fa-chevron-right glyphicon glyphicon-chevron-right"></i>' +
            '</div>' +
            '</div>' +
            this.cbodyHtml +
            '</div>' +
            '<div class="clearBtn" hidden>清除</div>' +
            '</div>';
        //custom options from user
        if (typeof options !== 'object' || options === null)
            options = {};

        //allow setting options with data attributes
        //data-api options will be overwritten with custom javascript options
        options = $.extend(this.element.data(), options);


        this.parentEl = (options.parentEl && $(options.parentEl).length) ? $(options.parentEl) : $(this.parentEl);
        this.container = $(this.template).appendTo(this.parentEl);

        if (typeof options.locale === 'object') {
            if (typeof options.autoUpdateInput === 'boolean')
                this.autoUpdateInput = options.autoUpdateInput;

            if (typeof options.locale.format === 'string')
                this.locale.format = options.locale.format;

            if (typeof options.minDate === 'object')
                this.minDate = moment(options.minDate);

            if (typeof options.maxDate === 'object')
                this.maxDate = moment(options.maxDate);
        }

        //
        // event listeners
        //
        this.container.find('.calendar')
            .on('click.moonrangepicker', '.prev', $.proxy(this.clickPrev, this))
            .on('click.moonrangepicker', '.next', $.proxy(this.clickNext, this))
            .on('mousedown.moonrangepicker', '.moonBox.available', $.proxy(this.clickDate, this))
            .on('mouseenter.moonrangepicker', '.moonBox.available', $.proxy(this.hoverDate, this));
        this.container
            .on('click.moonrangepicker', '.clearBtn', $.proxy(this.clearChoose, this));

        if (this.element.is('input') || this.element.is('button')) {
            this.element.on({
                'click.moonrangepicker': $.proxy(this.show, this),
                'focus.moonrangepicker': $.proxy(this.show, this),
                'keyup.moonrangepicker': $.proxy(this.elementChanged, this),
                'keydown.moonrangepicker': $.proxy(this.keydown, this) //IE 11 compatibility
            });
        } else {
            this.element.on('click.moonrangepicker', $.proxy(this.toggle, this));
            this.element.on('keydown.moonrangepicker', $.proxy(this.toggle, this));
        }

        //some state information
        this.isShowing = false;
        this.leftCalendar = {};
        this.rightCalendar = {};

        this.updateElement();
    };
    moonRangePicker.prototype = {
        constructor: moonRangePicker,
        setStartDate: function (val) {
            this.startDate = val;
            this.container.find('.calendar.left').attr('val', moment(val).format('YYYY-MM'));

            if (!this.isShowing)
                this.updateElement();

            var startDate = this.startDate;
            this.container.find('.moonBox').each(function (index, el) {

                var cal = $(el).parents('.calendar');
                var itVal = $(this).text().replace('月', '');
                var dt = moment(cal.find('.yearBox').text() + '-' + itVal);

                // 处理选择高亮
                if (dt.isSame(startDate, 'moon')) {
                    $(el).addClass('active');
                } else {
                    $(el).removeClass('active');
                }
            });
        },
        setEndDate: function (val) {
            this.endDate = val;
            this.container.find('.calendar.right').attr('val', moment(val).format('YYYY-MM'));

            if (!this.isShowing)
                this.updateElement();
        },
        updateView: function () {
            this.updateCalendars();// 更新点选
        },
        renderCalendar: function (side) {
            var minDate = this.minDate;
            var maxDate = this.maxDate;

            this.container.find('.moonBox').each(function () {
                var cal = $(this).parents('.calendar');
                var date = moment(cal.find('.yearBox').text() + '-' + $(this).text().replace('月', ''));

                if((minDate && date.isBefore(minDate,'month')) || (maxDate && date.isAfter(maxDate,'month'))){
                    $(this).removeClass('available').addClass('disable');
                }else {
                    $(this).removeClass('disable').addClass('available');
                }
            });
        },

        updateCalendars: function () {
            this.renderCalendar();

            // this.container.find('.moonBox').removeClass('active');
            // if (this.endDate == null) return;

            this.calculateChosenLabel();

        },

        calculateChosenLabel: function () {
            var startDate = this.startDate;
            var endDate = this.endDate;
            if (startDate) {
                this.container.find('.moonBox').each(function (index, el) {

                    var cal = $(el).parents('.calendar');
                    var itVal = $(this).text().replace('月', '');
                    var dt = moment(cal.find('.yearBox').text() + '-' + itVal);
                    // 处理in-range
                    if ((dt.isAfter(startDate) && dt.isBefore(endDate)) || dt.isSame(endDate, 'month')) {
                        $(el).addClass('in-range');
                    } else {
                        $(el).removeClass('in-range');
                    }

                    // 处理选择高亮
                    if (dt.isSame(startDate, 'month') || dt.isSame(endDate, 'month')) {
                        $(el).addClass('active');
                    } else {
                        $(el).removeClass('active');
                    }
                });
            }
        },

        move: function () {
            var parentOffset = {top: 0, left: 0},
                containerTop;
            var parentRightEdge = $(window).width();
            if (!this.parentEl.is('body')) {
                parentOffset = {
                    top: this.parentEl.offset().top - this.parentEl.scrollTop(),
                    left: this.parentEl.offset().left - this.parentEl.scrollLeft()
                };
                parentRightEdge = this.parentEl[0].clientWidth + this.parentEl.offset().left;
            }

            if (this.drops == 'up')
                containerTop = this.element.offset().top - this.container.outerHeight() - parentOffset.top;
            else
                containerTop = this.element.offset().top + this.element.outerHeight() - parentOffset.top;
            this.container[this.drops == 'up' ? 'addClass' : 'removeClass']('drop-up');

            if (this.opens == 'left') {
                this.container.css({
                    top: containerTop,
                    right: parentRightEdge - this.element.offset().left - this.element.outerWidth(),
                    left: 'auto'
                });
                if (this.container.offset().left < 0) {
                    this.container.css({
                        right: 'auto',
                        left: 9
                    });
                }
            } else if (this.opens == 'center') {
                this.container.css({
                    top: containerTop,
                    left: this.element.offset().left - parentOffset.left + this.element.outerWidth() / 2
                    - this.container.outerWidth() / 2,
                    right: 'auto'
                });
                if (this.container.offset().left < 0) {
                    this.container.css({
                        right: 'auto',
                        left: 9
                    });
                }
            } else {
                this.container.css({
                    top: containerTop,
                    left: this.element.offset().left - parentOffset.left,
                    right: 'auto'
                });
                if (this.container.offset().left + this.container.outerWidth() > $(window).width()) {
                    this.container.css({
                        left: 'auto',
                        right: 0
                    });
                }
            }
        },

        show: function (e) {
            if (this.isShowing) return;

            // Create a click proxy that is private to this instance of datepicker, for unbinding
            this._outsideClickProxy = $.proxy(function (e) {
                this.outsideClick(e);
            }, this);

            // Bind global datepicker mousedown for hiding and
            $(document)
                .on('mousedown.moonrangepicker', this._outsideClickProxy)
                // also support mobile devices
                .on('touchend.moonrangepicker', this._outsideClickProxy)
                // also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
                .on('click.moonrangepicker', '[data-toggle=dropdown]', this._outsideClickProxy)
                // and also close when focus changes to outside the picker (eg. tabbing between controls)
                .on('focusin.moonrangepicker', this._outsideClickProxy);

            // Reposition the picker if the window is resized while it's open
            $(window).on('resize.moonrangepicker', $.proxy(function (e) {
                this.move(e);
            }, this));

            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();
            this.previousRightTime = this.endDate.clone();

            this.updateView();
            this.container.show();
            this.move();
            this.element.trigger('show.moonrangepicker', this);
            this.element.attr('readonly', true);// 配置只读
            this.isShowing = true;
        },

        hide: function (e) {
            if (!this.isShowing) return;

            // //incomplete date selection, revert to last values
            // if (!this.endDate) {
            //     this.startDate = this.oldStartDate.clone();
            //     this.endDate = this.oldEndDate.clone();
            // }
            //
            // //if a new date range was selected, invoke the user callback function
            // if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate))
            //     this.callback(this.startDate.clone(), this.endDate.clone(), this.chosenLabel);

            //if picker is attached to a text input, update it
            this.updateElement();

            $(document).off('.moonrangepicker');
            $(window).off('.moonrangepicker');
            this.container.hide();
            this.element.trigger('hide.moonrangepicker', this);
            this.isShowing = false;
        },

        toggle: function (e) {
            if (this.isShowing) {
                this.hide();
            } else {
                this.show();
            }
        },

        outsideClick: function (e) {
            var target = $(e.target);
            // if the page is clicked anywhere except within the daterangerpicker/button
            // itself then call this.hide()
            if (
                // ie modal dialog fix
            e.type == "focusin" ||
            target.closest(this.element).length ||
            target.closest(this.container).length ||
            target.closest('.calendar-table').length
            ) return;
            this.hide();
            this.element.trigger('outsideClick.moonrangepicker', this);
            // var val = this.element.val();
            // if(val){
            //     this.startDate = moment(val.slice(0,7));
            //     this.endDate = moment(val.slice(10,17));
            // }
        },

        clickDate: function (e) {

            if (!$(e.target).hasClass('available')) return;

            var cal = $(e.target).parents('.calendar');
            var date = moment(cal.find('.yearBox').text() + '-' + $(e.target).text().replace('月', ''));

            //
            // this function needs to do a few things:
            // * alternate between selecting a start and end date for the range,
            // * if the time picker is enabled, apply the hour/minute/second from the select boxes to the clicked date
            // * if autoapply is enabled, and an end date was chosen, apply the selection
            // * if single date picker mode, and time picker isn't enabled, apply the selection immediately
            // * if one of the inputs above the calendars was focused, cancel that manual input
            //

            if (this.endDate || date.isBefore(this.startDate, 'day')) { //picking start

                this.endDate = null;
                this.setStartDate(date.clone());
            } else if (!this.endDate && date.isBefore(this.startDate)) {
                //special case: clicking the same date for start/end,
                //but the time of the end date is before the start date
                this.setEndDate(this.startDate.clone());
            } else { // picking end

                this.setEndDate(date.clone());
                if (this.autoApply) {
                    // this.calculateChosenLabel();
                    this.clickApply();
                    // this.updateElement();// 更新值
                }
            }

            this.updateView();

            //This is to cancel the blur event handler if the mouse was in one of the inputs
            e.stopPropagation();
        },

        clickApply: function (e) {
            this.hide();
            this.element.trigger('apply.moonrangepicker', this);
        },

        clickCancel: function (e) {
            this.startDate = this.oldStartDate;
            this.endDate = this.oldEndDate;
            this.hide();
            this.element.trigger('cancel.daterangepicker', this);
        },

        hoverDate: function (e) {
            if (!$(e.target).hasClass('available')) return;

            var cal = $(e.target).parents('.calendar');
            var date = moment(cal.find('.yearBox').text() + '-' + $(e.target).text().replace('月', ''));

            var startDate = this.startDate;
            if (!this.endDate) {
                this.container.find('.moonBox').each(function (index, el) {

                    var cal = $(el).parents('.calendar');
                    var itVal = $(this).text().replace('月', '');
                    var dt = moment(cal.find('.yearBox').text() + '-' + itVal);

                    if ((dt.isAfter(startDate) && dt.isBefore(date)) || dt.isSame(date, 'day')) {
                        $(el).addClass('in-range');
                    } else {
                        $(el).removeClass('in-range');
                    }
                });
            }
        },

        updateElement: function () {
            if(this.startDate && this.endDate){
                if (this.element.is('input') && this.autoUpdateInput) {
                    var newValue = this.startDate.format(this.locale.format);
                    newValue += this.locale.separator + this.endDate.format(this.locale.format);
                    if (newValue !== this.element.val()) {
                        this.element.val(newValue).trigger('change');
                    }
                }
            }else {
                this.startDate = this.oldStartDate.clone();
                this.endDate = this.oldEndDate.clone();
            }
        },

        clickPrev: function (e) {
            var nowY;
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                nowY = cal.find('.yearBox').text();
                cal.find('.yearBox').text(nowY - 1);
                cal.siblings('.right').find('.yearBox').text(nowY);
            }
            this.updateCalendars();
        },

        clickNext: function (e) {
            var nowY;
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('right')) {
                nowY = cal.find('.yearBox').text();
                cal.find('.yearBox').text(Number(nowY) + 1);
                cal.siblings('.left').find('.yearBox').text(nowY);
            }
            this.updateCalendars();
        },

        clearChoose: function (e) {
            var cal = $(e.target);
            if (cal.hasClass('clearBtn')) {
                this.element.val('');
            }
            this.updateCalendars();
        }
    };
    $.fn.moonrangepicker = function (options, callback) {
        var implementOptions = $.extend(true, {}, $.fn.moonrangepicker.defaultOptions, options);
        this.each(function () {
            var el = $(this);
            if (el.data('moonrangepicker'))
                el.data('moonrangepicker').remove();
            el.data('moonrangepicker', new moonRangePicker(el, implementOptions, callback));
        });
        return this;
    };

    return moonRangePicker;
}();