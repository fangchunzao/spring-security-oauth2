$(function () {
// 加载省
    loadProvince(['#n_province']);
    // 加载级别下拉列表
    loadMedicalOrgLevel('#n_medicalOrgLevel');
    // 加载等次下拉列表
    loadMedicalOrgGrade('#n_medicalOrgGrade');
    // 初始化终端类型
    loadRegisterandMechanismLv1(3, '#n_cusTypeName');
    // 初始化注册类型一级下拉列表
    loadRegisterandMechanismLv1(2, '#n_registerLev1');
    // 初始化机构类别一级下拉列表
    loadRegisterandMechanismLv1(1, '#n_mechanismLev1');
    // 装载chosen-select插件
    if (!ace.vars['touch']) {
        $('.chosen-select').chosen({allow_single_deselect: true});
    }
});
// 编辑主数据
function editMasterData(rowData) {
    resetModalInfo();
    $("#checkBtn").show();
    $("#modal_title").text('编辑主数据');
    $("#n_medicalOrgName").val(rowData.medicalOrgName);
    $('#old_medicalOrgName').val(rowData.medicalOrgName);
    $("#n_province").val(rowData.provinceCode ? rowData.provinceCode : '-1');
    $("#n_province").trigger("chosen:updated");
    loadCity('#n_province', '#n_city').success(function () {
        $("#n_city").val(rowData.cityCode ? rowData.cityCode : '-1');
        $("#n_city").trigger("chosen:updated");
        loadDistrict('#n_city', '#n_district').success(function () {
            $("#n_district").val(rowData.areaCode ? rowData.areaCode : '-1');
            $("#n_district").trigger("chosen:updated");
        })
    });
    $("#n_address").val(rowData.address);
    $("#n_countyFlag").val(rowData.countyFlag);
    $("#n_countyFlag").trigger("chosen:updated");
    if (rowData.longitude && rowData.latitude) {
        $("#n_longitudeAndlatitude").val(rowData.longitude + ',' + rowData.latitude);
        $('#n_longitudeAndlatitude').attr('longitude', rowData.longitude);
        $('#n_longitudeAndlatitude').attr('latitude', rowData.latitude);
    } else {
        $("#n_longitudeAndlatitude").val('');
    }
    $("#n_telephone").val(rowData.telephone);
    $("#n_medicalOrgURL").val(rowData.medicalOrgURL);
    $("#n_postCode").val(rowData.postCode);
    $("#n_medicalOrgDesp").val(rowData.medicalOrgDesp);
    $("#n_organizationID").val(rowData.organizationID);
    $("#n_administrationCode").val(rowData.administrationCode);
    $("#n_outpatientNum").val(rowData.outpatientNum);
    $("#n_bedNum").val(rowData.bedNum);
    $("#n_higherAuthority").val(rowData.higherAuthority);
    $("#n_registerLev1").val(rowData.registerLev1Code);
    $("#n_registerLev1").trigger("chosen:updated");
    loadRegisterLev('#n_registerLev1','#n_registerLev2').success(function () {
        $("#n_registerLev2").val(rowData.registerLev2Code);
        $("#n_registerLev2").trigger("chosen:updated");
    });
    $("#n_medicalOrgLevel").val(rowData.medicalOrgLevelCode);
    $("#n_medicalOrgLevel").trigger("chosen:updated");
    $("#n_medicalOrgGrade").val(rowData.medicalOrgGradeCode);
    $("#n_medicalOrgGrade").trigger("chosen:updated");
    $("#n_mechanismLev1").val(rowData.mechanismLev1Code);
    $("#n_mechanismLev1").trigger("chosen:updated");
    $("#n_dtpFlag").val(rowData.dtpFlag);
    $("#n_dtpFlag").trigger("chosen:updated");
    loadMechanismLev('#n_mechanismLev1','#n_mechanismLev2').success(function () {
        $("#n_mechanismLev2").val(rowData.mechanismLev2Code);
        $("#n_mechanismLev2").trigger("chosen:updated");
        loadMechanismLev('#n_mechanismLev2','#n_mechanismLev3').success(function () {
            $("#n_mechanismLev3").val(rowData.mechanismLev3Code);
            $("#n_mechanismLev3").trigger("chosen:updated");
        })
    });
    $('#n_cusTypeName').val(rowData.cusTypeCode);
    $("#n_dataFrom").val(rowData.dataFrom);
    if($("#n_checkFlag").length>0){
        $("#n_checkFlag").val(rowData.cheackFlag=='1'?'已校验':'未校验');
    }
    $("#newMasterData-modal").attr('updateFlag', 2);
    $("#newMasterData-modal").attr('ysID', rowData.ysID);
    $("#newMasterData-modal").attr('finalYsID', rowData.finalYsID);
    $("#newMasterData-modal").modal('show');
}

// 新增主数据
function newMasterData() {
    $("#checkBtn").hide();
    $("#modal_title").text('新增主数据');
    resetModalInfo();
    $("#newMasterData-modal").modal('show');
}

// 清空新增/编辑modal内容
function resetModalInfo() {
    $("#n_medicalOrgName").val('');
    $('#old_medicalOrgName').val('');
    $("#n_province").val('-1');
    $("#n_city").val('-1');
    $("#n_district").val('-1');
    $("#n_district").trigger("chosen:updated");
    $("#n_address").val('');
    $("#n_countyFlag").val('');
    $("#n_countyFlag").trigger("chosen:updated");
    $("#n_longitudeAndlatitude").val('');
    $('#n_longitudeAndlatitude').attr('longitude', '');
    $('#n_longitudeAndlatitude').attr('latitude', '');
    $("#n_telephone").val('');
    $("#n_medicalOrgURL").val('');
    $("#n_postCode").val('');
    $("#n_medicalOrgDesp").val('');
    $("#n_organizationID").val('');
    $("#n_administrationCode").val('');
    $("#n_outpatientNum").val('');
    $("#n_bedNum").val('');
    $("#n_higherAuthority").val('');
    $("#n_registerLev1").val('');
    $("#n_registerLev1").trigger("chosen:updated");
    $("#n_registerLev2").val('');
    $("#n_registerLev2").trigger("chosen:updated");
    $("#n_medicalOrgLevel").val('');
    $("#n_medicalOrgLevel").trigger("chosen:updated");
    $("#n_medicalOrgGrade").val('');
    $("#n_medicalOrgGrade").trigger("chosen:updated");
    $("#n_mechanismLev1").val('');
    $("#n_mechanismLev1").trigger("chosen:updated");
    $("#n_mechanismLev2").val('');
    $("#n_mechanismLev2").trigger("chosen:updated");
    $("#n_mechanismLev3").val('');
    $("#n_mechanismLev3").trigger("chosen:updated");
    $('#n_cusTypeName').val('');
    $('#n_cusTypeName').trigger("chosen:updated");
    $('#n_dtpFlag').val('');
    $('#n_dtpFlag').trigger("chosen:updated");
    $("#n_dataFrom").val('');
    $("#newMasterData-modal").attr('updateFlag', 1);
    $("#newMasterData-modal").attr('ysID', '');
    $("#newMasterData-modal").attr('finalYsID', '');
}

// 保存按钮
function saveEdit() {
    var successRequire;
    var commonCall = {};
    commonCall.success = function (fn) {
        successRequire = fn;
    };

    // 校验空
    var validFlag = true;
    $(".search_Condition_box .requireInput input[id],.search_Condition_box .requireInput select[id]").each(function () {
        if ($(this).is('input') && $(this).val() == '') {
            validFlag = false;
            layer.msg($(this).attr('placeholder') + '不可为空');
            return false;
        } else if ($(this).is('select') && ($(this).val() == '' || $(this).val() == '-1' || $(this).val() == null)) {
            validFlag = false;
            layer.msg($(this).attr('placeholder') + '不可为空');
            return false;
        }
    });
    if (validFlag) {
        var checkFlag = $("#newMasterData-modal").attr('updateFlag');
        var param = {
            medicalOrgName: $("#n_medicalOrgName").val(),
            provinceCode: $("#n_province").val(),
            provinceName: $("#n_province option:selected").text(),
            cityCode: $("#n_city").val(),
            cityName: $("#n_city option:selected").text(),
            areaCode: $("#n_district").val(),
            areaName: $("#n_district").val()?$("#n_district option:selected").text():'',
            address: $("#n_address").val(),
            countyFlag: $("#n_countyFlag").val(),
            longitude: $('#n_longitudeAndlatitude').attr('longitude'),
            latitude: $('#n_longitudeAndlatitude').attr('latitude'),
            telephone: $("#n_telephone").val(),
            medicalOrgURL: $("#n_medicalOrgURL").val(),
            postCode: $("#n_postCode").val(),
            medicalOrgDesp: $("#n_medicalOrgDesp").val(),
            organizationID: $("#n_organizationID").val(),
            administrationCode: $("#n_administrationCode").val(),
            outpatientNum: $("#n_outpatientNum").val(),
            bedNum: $("#n_bedNum").val(),
            higherAuthority: $("#n_higherAuthority").val(),
            registerLev1: $("#n_registerLev1").val() ? $("#n_registerLev1 option:selected").text() : '',
            registerLev1Code: $("#n_registerLev1").val() ? $("#n_registerLev1").val() : '',
            registerLev2: $("#n_registerLev2").val() ? $("#n_registerLev2 option:selected").text() : '',
            registerLev2Code: $("#n_registerLev2").val() ? $("#n_registerLev2").val() : '',
            medicalOrgLevel: $("#n_medicalOrgLevel").val() ? $("#n_medicalOrgLevel option:selected").text() : '',
            medicalOrgLevelCode: $("#n_medicalOrgLevel").val() ? $("#n_medicalOrgLevel").val() : '',
            medicalOrgGrade: $("#n_medicalOrgGrade").val() ? $("#n_medicalOrgGrade option:selected").text() : '',
            medicalOrgGradeCode: $("#n_medicalOrgGrade").val() ? $("#n_medicalOrgGrade").val() : '',
            mechanismLev1: $("#n_mechanismLev1").val() ? $("#n_mechanismLev1 option:selected").text() : '',
            mechanismLev1Code: $("#n_mechanismLev1").val() ? $("#n_mechanismLev1").val() : '',
            mechanismLev2: $("#n_mechanismLev2").val() ? $("#n_mechanismLev2 option:selected").text() : '',
            mechanismLev2Code: $("#n_mechanismLev2").val() ? $("#n_mechanismLev2").val() : '',
            mechanismLev3: $("#n_mechanismLev3").val() ? $("#n_mechanismLev3 option:selected").text() : '',
            mechanismLev3Code: $("#n_mechanismLev3").val() ? $("#n_mechanismLev3").val() : '',
            cusTypeName:$('#n_cusTypeName').val()?$('#n_cusTypeName option:selected').text():'',
            cusTypeCode:$('#n_cusTypeName').val()?$('#n_cusTypeName').val():'',
            dataFrom: $("#n_dataFrom").val() ? $("#n_dataFrom").val() : '',
            checkFlag: checkFlag,
            dtpFlag:$("#n_dtpFlag").val() ? $("#n_dtpFlag").val() : ''
        };
        if (checkFlag == 2) { // 编辑时需传ysID& finalYsID
            param.ysID = $("#newMasterData-modal").attr('ysID');
            param.finalYsID = $("#newMasterData-modal").attr('finalYsID');
            param.old_medicalOrgName = $('#old_medicalOrgName').val();
        }
        $.tAjax('/api/service/insertDataMaster', param).success(function (res) {
            if (res.success) {
                $("#newMasterData-modal").modal('hide');
                loadTable();
                if (successRequire) {
                    successRequire();
                }
            }
            layer.msg(res.msg);
        });
    }
    return commonCall;
}

// 改变主数据校验状态 校验按钮
function checkRes() {
    layer.confirm("是否将当前数据校验状态变更为已校验？", {
        btn: ['是', '否'] //按钮
    }, function (index) {
        layer.close(index);
        $.tAjax('/api/service/dataMasterCheckOut', {
            ysID: $("#newMasterData-modal").attr('ysID')
        }).success(function (res) {
            layer.msg(res.msg);
            if (res.success) {
                $("#newMasterData-modal").modal('hide');
                loadTable();
            }
        });
    });
}

// 显示经纬度选择modal
function showChooseModal() {
    var medicalOrgName = $("#n_medicalOrgName").val();
    if (!medicalOrgName) {
        layer.msg('请填写标准终端名后进行选择经纬度操作');
        return;
    }
    loadGPSList(medicalOrgName);
    $("#chooseRegion-modal").modal('show');
    setTimeout(function () {
        $("#chooseRegion-modal").resize();
    }, 250);
    $(".modal-backdrop").eq(1).css('z-index', 1059);
}

// 选择经纬度modal
function loadGPSList(medicalOrgName) {
    if ($("#modal_tableBox").html() !== '') {
        $("#modal_tableBox").jqGrid("clearGridData");
        $("#modal_tableBox").jqGrid('setGridParam', {
            postData: {
                medicalOrgName: medicalOrgName
            }
        }).trigger('reloadGrid');
    } else {
        var obj = {
            url: '/api/service/searchGPSInfo',
            postData: {
                medicalOrgName: medicalOrgName
            },
            colModel: [
                {name: 'name', index: 'name', width: 210, label: '标准终端名'},
                {name: 'pname', index: 'pname', width: 120, label: '省'},
                {name: 'cityname', index: 'cityname', width: 120, label: '市'},
                {name: 'adname', index: 'adname', width: 120, label: '区'},
                {name: 'address', index: 'address', width: 160, label: '地址'},
                {name: 'location', index: 'location', width: 180, label: '经纬度'}
            ],
            pager: "#modal_tableBox-pager",
            gridComplete: function () { // 隐藏全选
                $("#cb_modal_tableBox").hide();
                return (true);
            },
            beforeSelectRow: function () { // hack成单选
                $("#modal_tableBox").jqGrid('resetSelection');
                return (true);
            }
        };
        $("#modal_tableBox").drawTable(obj);
    }
}

// 确认选择经纬度按钮
function saveChoose() {
    var idArr = $('#modal_tableBox').jqGrid('getGridParam', 'selarrrow');
    if (idArr.length == 0 || !idArr.length) {
        layer.msg('请选择一条经纬度信息后进行确认选择操作');
        return;
    }
    var rowData = $("#modal_tableBox").jqGrid('getRowData', idArr[0]);
    $('#n_longitudeAndlatitude').val(rowData.location);
    var longitude = rowData.location.split(',')[0];
    var latitude = rowData.location.split(',')[1];
    $('#n_longitudeAndlatitude').attr('longitude', longitude);
    $('#n_longitudeAndlatitude').attr('latitude', latitude);
    $("#chooseRegion-modal").modal('hide');
}

// 终端Mapping中保存对主数据的编辑
function saveEditInMapping() {
    saveEdit().success(function () {
        searchCusList();
    });
}
