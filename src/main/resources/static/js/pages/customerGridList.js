$(function () {
    $("#customerTable").tableResize();
    loadCustomerGridList();
    loadProvince('#sc_province');
    // 修正第二个modle关闭引发的scroll表现不正确的Bug
    $('#showCustomerGridList').on('hide.bs.modal', function () {
        setTimeout(function () {
            $('body').addClass('modal-open');
        }, 510);
    });
});

// modal的show处理
function showCustomerModal(selector) {
    resetCustomerModlaSearch();
    $("#showCustomerGridList").attr('selector', selector); // 暂存，用于关闭modal时的返回
    $("#customerTable").jqGrid('resetSelection'); // 重置表格选择状态
    $("#showCustomerGridList").modal('show');
    setTimeout(function () {
        $("#showCustomerGridList").resize();
    },250);
    $(".modal-backdrop").eq(1).css('z-index', 1059);
}

// 加载grid
function loadCustomerGridList() {
    if ($("#customerTable").html() !== '') {
        $("#customerTable").jqGrid("clearGridData");
        $("#customerTable").jqGrid('setGridParam',
            {
                postData: {
                    provinceCode: $("#sc_province").val(),
                    cityCode: $("#sc_city").val()
                }
            }).trigger('reloadGrid');
    } else {
        var obj = {
            url: '/api/manu/searchCustomerForManu',
            colModel: [
                {name: 'customerCode', index: 'customerCode', width: 160, label: '客户编码', frozen: true},
                {name: 'customerName', index: 'customerName', width: 200, label: '客户名', frozen: true},
                {name: 'provinceName', index: 'provinceName', width: 120, label: '客户省'},
                {name: 'cityName', index: 'cityName', width: 120, label: '客户市'},
                {name: 'address', index: 'address', width: 120, label: '地址'}
            ],
            pager: "#customerTable-pager",
            gridComplete: function () { // 隐藏全选
                $("#cb_customerTable").hide();
                return (true);
            },
            beforeSelectRow: function () { // hack成单选
                $("#customerTable").jqGrid('resetSelection');
                return (true);
            }
        };
        $("#customerTable").drawTable(obj);
        $("#customerTable").closest(".ui-jqgrid-bdiv").css({"overflow-x": "scroll"});
    }
}

// 确认选择按钮
function saveChooseCustomer() {
    var selector = $("#showCustomerGridList").attr('selector');
    var id = $("#customerTable").jqGrid('getGridParam', 'selarrrow');
    var rowData = $("#customerTable").jqGrid('getRowData', id);
    $(selector).val(rowData.customerName);
    $(selector).attr('title',rowData.customerName);
    $(selector).attr('customerCode',rowData.customerCode);
    $("#showCustomerGridList").modal('hide');
}

//检索清空
function resetCustomerModlaSearch() {
    $("#sc_province").val('');
    $("#sc_city").val('');
    $("#sc_province").trigger("chosen:updated");
    $("#sc_city").trigger("chosen:updated");
}