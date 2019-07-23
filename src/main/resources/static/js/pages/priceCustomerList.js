$(function () {
    $("#customerTable").tableResize();
    loadProvince('#sc_province');
    // 修正第二个modle关闭引发的scroll表现不正确的Bug
    $('#showCustomerGridList').on('hide.bs.modal', function () {
        setTimeout(function () {
            $('body').addClass('modal-open');
        }, 510);
    });
});

// modal的show处理
function showCustomerModal(selector,hospitalFlag) {
    resetCustomerModlaSearch();
    $("#showCustomerGridList").attr('hospitalFlag',hospitalFlag);//区分  1 ：非医院  2：医院
    $("#showCustomerGridList").attr('selector', selector); // 暂存，用于关闭modal时的返回
    loadCustomerGridList();
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
                    cusName:$('#sc_cusName').val()?$('#sc_cusName').val():'',
                    province: $("#sc_province").val()?$("#sc_province").val():'',
                    city: $("#sc_city").val()?$("#sc_city").val():'',
                    hospitalFlag:$("#showCustomerGridList").attr('hospitalFlag')?$("#showCustomerGridList").attr('hospitalFlag'):'' // 1 ：非医院  2：医院
                }
            }).trigger('reloadGrid');
    } else {
        var obj = {
            url: '/api/service/searchCustomerMasterStandard',
            colModel: [
                {name: 'ysID', index: 'ysID', width: 160, label: '终端编码', frozen: true},
                {name: 'medicalOrgName', index: 'medicalOrgName', width: 200, label: '终端名', frozen: true},
                {name: 'provinceName', index: 'provinceName', width: 120, label: '终端省'},
                {name: 'cityName', index: 'cityName', width: 120, label: '终端市'},
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
            },
            postData: {
                hospitalFlag:$("#showCustomerGridList").attr('hospitalFlag') // 1 ：非医院  2：医院
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
    $(selector).val(rowData['medicalOrgName']);
    $(selector).attr('title',rowData['medicalOrgName']);
    $(selector).attr('customerCode',rowData['ysID']);
    $("#showCustomerGridList").modal('hide');
}

//检索清空
function resetCustomerModlaSearch() {
    $('#sc_cusName').val('');
    $("#sc_province").val('');
    $("#sc_city").val('');
    $("#sc_city").html('');
    $("#sc_province").trigger("chosen:updated");
    $("#sc_city").trigger("chosen:updated");
}