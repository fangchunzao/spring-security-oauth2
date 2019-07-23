$(function () {
    loadQuestionOptions();
     // 修正第二个modle关闭引发的scroll表现不正确的Bug
    $('#question-modal').on('hide.bs.modal', function () {
        setTimeout(function () {
            $('body').addClass('modal-open');
        }, 510);
    });
    // 修正第二个modle关闭引发的scroll表现不正确的Bug
    $('#newProductTrans-modal').on('hide.bs.modal', function () {
        setTimeout(function () {
            $('body').addClass('modal-open');
        }, 510);
    });
});

// modal数据初始化
function loadModalInfo(rowData){
    resetSearchTab1();
    modleSearch();
    $("#productMapping-modal").modal('show');
    $("#companyName").html(rowData.productedManu);
    $("#companyName").attr('companyCode', rowData.companyCode);
    $("#productMapping-modal").attr('dealerCode',rowData.dealerCode);
    $("#productMapping-modal").attr('productedManu',rowData.productedManu);
    $("#productMapping-modal").attr('source',rowData.source);
    $("#srcProductName").html(rowData.srcProductName);
    $("#productLotNum").html(rowData.productLotNum);
    $("#selectTransType1").val('');
    $("#selectTransType1").trigger("chosen:updated");
    if(rowData.effectFlag == '1'){
        $("#questionBtn").hide();
    }else {
        $("#questionBtn").show();
    }
    $("#questionBtn").attr('effectFlag',rowData.effectFlag);
    setTimeout(function () {
        $("#productMapping-modal").resize();
    }, 250)
}

// 单条数据Mapping 检索
function modleSearch() {
    var searchCondition = {};
    searchCondition.generalName = $("#modle_generalName").val();
    searchCondition.productName = $("#modle_productName").val();
    searchCondition.chemicalName = $("#modle_chemicalName").val();
    searchCondition.productFormat = $("#modle_productFormat").val();
    searchCondition.modle_miniName = $("#modle_miniName").val();
    searchCondition.productMetering = $("#modle_productMetering").val();
    searchCondition.productLotNum = $("#modle_productLotNum").val();

    if ($("#grid-table-Modle").html() !== '') {
        $("#grid-table-Modle").jqGrid("clearGridData");
        $("#grid-table-Modle").jqGrid('setGridParam',
            {
                postData: {
                    generalName: searchCondition.generalName
                        ? searchCondition.generalName : '',
                    productName: searchCondition.productName
                        ? searchCondition.productName : '',
                    chemicalName: searchCondition.chemicalName
                        ? searchCondition.chemicalName : '',
                    productFormat: searchCondition.productFormat
                        ? searchCondition.productFormat : '',
                    modle_miniName: searchCondition.modle_miniName
                        ? searchCondition.modle_miniName : '',
                    productMetering: searchCondition.productMetering ? searchCondition.productMetering : '',
                    productLotNum: searchCondition.productLotNum ? searchCondition.productLotNum : ''

                }
            }).trigger('reloadGrid');
    } else {
        var obj = {
            url: '/api/service/searchProductInfo',
            postData: {
                generalName: searchCondition.generalName ? searchCondition.generalName
                    : '',
                productName: searchCondition.productName ? searchCondition.productName
                    : '',
                chemicalName: searchCondition.chemicalName
                    ? searchCondition.chemicalName : '',
                productFormat: searchCondition.productFormat
                    ? searchCondition.productFormat : '',
                modle_miniName: searchCondition.modle_miniName
                    ? searchCondition.modle_miniName : '',
                productMetering: searchCondition.productMetering ? searchCondition.productMetering : '',
                productLotNum: searchCondition.productLotNum ? searchCondition.productLotNum : ''
            },
            colModel: [
                {name: 'productName', index: 'productName', width: 80, label: '标准产品名'},
                {name: 'chemicalName', index: 'chemicalName', width: 80, label: '化学名'},
                {name: 'generalName', index: 'generalName', width: 80, label: '通用名'},
                {name: 'miniName', index: 'miniName', width: 80, label: '简写'},
                {
                    name: 'productFormat',
                    index: 'productFormat',
                    width: 80,
                    label: '标准产品规格'
                },
                {
                    name: 'productMetering',
                    index: 'productMetering',
                    width: 80,
                    label: '标准产品计量单位'
                },
                {name: 'companyCode', hidden: true},
                {name: 'productedManu', hidden: true},
                {name: 'productCode', hidden: true}
            ],
            pager: "#grid-pager-Modle",
            onSelectRow: function (rowid, status) {
                if (status) {
                    var rowData = $("#grid-table-Modle").jqGrid('getRowData', rowid);
                    loadConvertList("#selectTransType1", rowData);
                }
            },
            gridComplete: function () { // 隐藏全选
                $("#cb_grid-table-Modle").hide();
                return (true);
            },
            beforeSelectRow: function () { // hack成单选
                $("#grid-table-Modle").jqGrid('resetSelection');
                return (true);
            }
        };
        $("#grid-table-Modle").drawTable(obj);
    }
}

// 单条数据Mapping 清空查询条件
function resetSearchTab1() {
    $("#modle_generalName").val('');
    $("#modle_productName").val('');
    $("#modle_chemicalName").val('');
    $("#modle_miniName").val('');
    $("#modle_productFormat").val('');
    $("#modle_productMetering").val('');
    $("#modle_productLotNum").val('');
}

//modle 完成按钮
function submitTab1Modle() {
    var convertCode = $("#selectTransType1 option:selected").val();
    if (convertCode !== '') {
        var id = $("#grid-table-Modle").jqGrid('getGridParam', 'selrow');
        var rowData = $("#grid-table-Modle").jqGrid('getRowData', id);
        layer.load(1);
        $.tAjax('/api/service/updateProductMapping', {
            companyCode: rowData.companyCode,
            productCode: rowData.productCode,
            convertCode: convertCode,
            srcProductName: $("#srcProductName").text(),
            dealerCode:$("#productMapping-modal").attr('dealerCode'),
            productedManu:$("#productMapping-modal").attr('productedManu')?$("#productMapping-modal").attr('productedManu'):'',
            convertValue:$("#selectTransType1 option:selected").attr('convertValue'), // 齐鲁新增字段 转化率number
            standardProductedManu:rowData.productedManu, // 齐鲁新增字段，标准生产厂商
            source: $("#productMapping-modal").attr("source") // 齐鲁新增字段，来源
        }).success(function (res) {
            layer.closeAll('loading');
            if (res.success) {
                layer.msg(res.msg);
                try{
                    loadTab1Table();
                }catch(e){}
            } else {
                layer.msg(res.msg);
            }
            $("#productMapping-modal").modal('hide');
        });
    } else {
        layer.msg('请选择转化率！');
    }
}

//问题件上报
function questionProduct() {
    $("#q_companyName").html($("#companyName").html());
    $("#q_srcProductName").html($("#srcProductName").html());
    $("#q_questionType").val(''); // 重置问题选项
    $("#q_questionType").trigger("chosen:updated");
    $("#question-modal").modal('show');
    $(".modal-backdrop").eq(1).css('z-index', 1059);
}

//问题件上报modle的上报按钮
function submitQuestion() {
    if($("#q_questionType").val()!=null && $("#q_questionType").val()!=''){
        layer.load(1);
        $.tAjax('/api/service/insertProblemMapping', {
            companyCode: $("#companyName").attr('companyCode'),
            srcProductName: $("#q_srcProductName").text(),
            problemTypeCode: $("#q_questionType").val(),
            problemTypeName: $("#q_questionType option:selected").text(),
            effectFlag: $("#questionBtn").attr('effectFlag')
        }).success(function (res) {
            layer.closeAll('loading');
            if (res.success) {
                loadTab1Table();
            }
            layer.msg(res.msg);
            $("#productMapping-modal").modal('hide');
            $("#question-modal").modal('hide');
        });
    }else {
        layer.msg('请选择问题类型后进行问题上报');
    }
}

//问题件上报的问题选项
function loadQuestionOptions() {
    $.tAjax('/api/common/getCommonMasterInfo', {
        codeKey: '0006'
    }).success(function (res) {
        if (res.success) {
            $("#q_questionType").html('');
            res.ddiComCodes.forEach(function (item) {
                var html = '<option value="' + item.code2 + '">' + item.value1 + '</option>';
                $("#q_questionType").append(html);
            });
            $("#q_questionType").trigger("chosen:updated");
        } else {
            layer.msg(res.msg);
        }
    });
}

// 加载转化率
function loadConvertList(selector, rowData) {
    $.tAjax('/api/service/searchProductConvert', {
        companyCode: rowData.companyCode ? rowData.companyCode : '',
        productCode: rowData.productCode ? rowData.productCode : ''
    }).success(function (res) {
        if (res.success) {
            $(selector).html(
                '<option value="" disabled selected>选择转化率</option>');
            var list = res.list ? res.list : [];
            list.forEach(function (item) {
                var str = '<option value="' + item.id + '" convertValue="'+item.number+'">'
                    + item.cell + '</option>';
                $(selector).append(str);
            });
        } else {
            layer.msg('无转化率信息');
            $(selector).val('');
            $(selector).html('<option value="" disabled selected>选择转化率</option>');
            $(selector).trigger("chosen:updated");
        }
    });
}

// 新增产品转化率
function addProductTrans() {
    var id= $("#grid-table-Modle").jqGrid('getGridParam','selrow');
    if(!id){
        layer.msg('请选择要新增转化率的产品后进行新增操作');
        return;
    }
    $("#newProductTrans-modal").attr('newTrans',true);
    $("#nt_srcMeteringName").val('');
    $("#nt_standardMeteringName").val('');
    $("#nt_convertNumber").val('');
    $("#newProductTrans-modal").modal('show');
    $(".modal-backdrop").eq(1).css('z-index', 1059);
}

// 产品转化率modal 保存按钮
function saveNewProductTrans() {
    var id= $("#grid-table-Modle").jqGrid('getGridParam','selrow');
    var rowData =$("#grid-table-Modle").jqGrid('getRowData',id);
    var validFlag = true;
    // 校验空
    $("#newProductTrans-modal .requireInput input[id]").each(function () {
        if ($(this).val() == '' || $(this).val() == null) {
            validFlag = false;
            layer.msg($(this).attr('placeholder') + '不可为空');
            return false;
        }
    });
    if(validFlag){
        var re = /(^\d{1,7}[\.]{1}\d{1,7}$)|(^\d{1,7}$)/; //判断正数
        if (!re.test($("#nt_convertNumber").val())) {
            layer.msg('转化率必须为最多7位整数7位小数的正数');
            validFlag = false;
            return false
        }
    }
    if(validFlag){
        layer.load(1);
        var parms = {
            productCode:rowData.productCode,
            srcMeteringName:$("#nt_srcMeteringName").val(),
            standardMeteringName:$("#nt_standardMeteringName").val(),
            convertNumber:$("#nt_convertNumber").val()
        };
        var ifNew = $("#newProductTrans-modal").attr('newTrans');
        var url;
        if(ifNew=='true'){
            url = '/api/manu/insertProductConvertBySingle';
        }
        $.tAjax(url,parms).success(function (res) {
            layer.closeAll('loading');
            if(res.success){
                $("#newProductTrans-modal").modal('hide');
                loadConvertList("#selectTransType1", rowData);
            }
            layer.msg(res.msg);
        });
    }
}
