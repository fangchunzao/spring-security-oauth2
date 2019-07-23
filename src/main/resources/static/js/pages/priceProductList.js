$(function () {
    $("#product-table").tableResize();
    // 修正第二个modle关闭引发的scroll表现不正确的Bug
    $('#showCustomerGridList').on('hide.bs.modal', function () {
        setTimeout(function () {
            $('body').addClass('modal-open');
        }, 510);
    });
});

//加载产品信息
function loadProductInfoTable(selector) {
    resetSearchProduct();
    loadProductInfo();
    $('#chooseProduct-Modle').modal('show');
    $("#chooseProduct-Modle").attr('selector', selector); // 暂存，用于关闭modal时的返回
    setTimeout(function () {
        $("#product-table").resize()
    }, 250);
}
//清空产品Modle查询条件
function resetSearchProduct() {
    $('#nc_productName').val('');
    $('#nc_productFormat').val('');
    $('#nc_productMetering').val('');
}

//选择产品modal 产品table
function loadProductInfo() {
    if ($("#product-table").html() !== '') {
        // 每次加载前清空
        $("#product-table").jqGrid("clearGridData");
        $("#product-table").jqGrid('setGridParam', {
            postData: {
                productName: $('#nc_productName').val() ? $('#nc_productName').val() : '',
                productFormat: $('#nc_productFormat').val() ? $('#nc_productFormat').val() : '',
                productMetering: $('#nc_productMetering').val() ? $('#nc_productMetering').val() : ''
            }
        }).trigger('reloadGrid');
    } else {
        var obj = {
            url: '/api/service/searchProductInfo',
            colModel: [
                {name: 'productCode', index: 'productCode', width: 140, label: '品规编码'},
                {name: 'productName', index: 'productName', width: 140, label: '品规'},
                {name: 'productFormat', index: 'productFormat', width: 140, label: '规格'},
                {name: 'productMetering', index: 'productMetering', width: 140, label: '计量单位'}
            ],
            pager: "#product-table-pager",
            gridComplete: function () { // 隐藏全选
                $("#cb_product-table").hide();
                return (true);
            },
            beforeSelectRow: function () { // hack成单选
                $("#product-table").jqGrid('resetSelection');
                return (true);
            },
            postData: {
                productName: $('#nc_productName').val() ? $('#nc_productName').val() : '',
                productFormat: $('#nc_productFormat').val() ? $('#nc_productFormat').val() : '',
                productMetering: $('#nc_productMetering').val() ? $('#nc_productMetering').val() : ''
            }
        };
        $("#product-table").drawTable(obj);
        // jQuery("#dealer-table").jqGrid('setFrozenColumns');
    }
}
//选择产品确认按钮
function submitProductChoose(){
    var id = $("#product-table").jqGrid('getGridParam', 'selarrrow');
    var rowData = $("#product-table").jqGrid('getRowData', id);
    var selector = $("#chooseProduct-Modle").attr('selector');
    $(selector).val(rowData.productName);
    $(selector).attr('productCode', rowData.productCode);
    $("#chooseProduct-Modle").modal('hide');
}