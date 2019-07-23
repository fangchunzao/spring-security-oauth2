$(function () {
    $("#dealerTable").tableResize();
    loadDealerGridList();
    loadProvince('#sd_province');
    // 修正第二个modle关闭引发的scroll表现不正确的Bug
    $('#showDealerGridList').on('hide.bs.modal', function () {
        setTimeout(function () {
            $('body').addClass('modal-open');
        }, 510);
    });
});

// modal的show处理
function showDealerModal(selector) {
    // resetModlaSearch();
    $("#showDealerGridList").attr('selector', selector); // 暂存，用于关闭modal时的返回
    $("#dealerTable").jqGrid('resetSelection'); // 重置表格选择状态
    $("#showDealerGridList").modal('show');
    setTimeout(function () {
        $("#showDealerGridList").resize();
    },250);
    $(".modal-backdrop").eq(1).css('z-index', 1059);
}

// 加载grid
function loadDealerGridList() {
    if ($("#dealerTable").html() !== '') {
        $("#dealerTable").jqGrid("clearGridData");
        $("#dealerTable").jqGrid('setGridParam',
            {
                postData: {
                    dealerName:$('#sd_dealerName').val(),
                    provinceCode: $("#sd_province").val(),
                    cityCode: $("#sd_city").val()
                }
            }).trigger('reloadGrid');
    } else {
        var obj = {
            url: '/api/appeal/searchCompanyDealerInfo',
            colModel: [
                {name: 'dealerCode', index: 'dealerCode', width: 160, label: '经销商编码', frozen: true},
                {name: 'dealerName', index: 'dealerName', width: 200, label: '经销商名称', frozen: true},
                {name: 'provinceName', index: 'provinceName', width: 120, label: '经销商'},
                {name: 'cityName', index: 'cityName', width: 120, label: '经销商市'},
                {name: 'districtName', index: 'districtName', width: 120, label: '经销商区'},
                {name: 'districtCode', index: 'districtCode', width: 120, label: '经销商区编码', hidden: true},
                {name: 'provinceCode', index: 'provinceCode', width: 120, label: '经销商省编码', hidden: true},
                {name: 'cityCode', index: 'cityCode', width: 120, label: '经销商市编码', hidden: true},
                {name: 'mailAddress', index: 'mailAddress', width: 120, label: '经销商邮箱', hidden: true},
                {name: 'telephoneNum', index: 'telephoneNum', width: 120, label: '经销商电话', hidden: true},
                {name: 'detailAddress', index: 'detailAddress', width: 120, label: '经销商地址', hidden: true},
                {name: 'dealerOrgCode', index: 'dealerOrgCode', width: 120, label: '经销商组织代码', hidden: true},
                {name: 'connectUser', index: 'connectUser', width: 120, label: '经销商联系人', hidden: true}
            ],
            pager: "#dealerTable-pager",
            gridComplete: function () { // 隐藏全选
                $("#cb_dealerTable").hide();
                return (true);
            },
            beforeSelectRow: function () { // hack成单选
                $("#dealerTable").jqGrid('resetSelection');
                return (true);
            }
        };
        $("#dealerTable").drawTable(obj);
        $("#dealerTable").closest(".ui-jqgrid-bdiv").css({"overflow-x": "scroll"});
    }
}

// 确认选择按钮
function saveChoose() {
    var selector = $("#showDealerGridList").attr('selector');
    var id = $("#dealerTable").jqGrid('getGridParam', 'selarrrow');
    var rowData = $("#dealerTable").jqGrid('getRowData', id);
    $(selector).val(rowData.dealerName);
    $(selector).attr('dealerCode',rowData.dealerCode);
    $("#showDealerGridList").modal('hide');
}

//检索清空
function resetModlaSearch() {
    $("#sd_province").val('');
    $("#sd_city").val('');
    $("#sd_dealerName").val('');
    $("#sd_province").trigger("chosen:updated");
    $("#sd_city").trigger("chosen:updated");
}