$(function () {
// 修正第二个modle关闭引发的scroll表现不正确的Bug
    $('#newMasterData-modal').on('hide.bs.modal', function () {
        setTimeout(function () {
            $('body').addClass('modal-open');
        }, 510);
    });
    // 新建临时主数据options
    // 加载级别下拉列表
    loadMedicalOrgLevel('#cn_medicalOrgLevel');
    // 加载等次下拉列表
    loadMedicalOrgGrade('#cn_medicalOrgGrade');
    // 初始化注册类型一级下拉列表
    loadRegisterandMechanismLv1(2, '#cn_registerLev1');
    // 初始化机构类别一级下拉列表
    loadRegisterandMechanismLv1(1, '#cn_mechanismLev1');
    // 初始化终端类型
    loadRegisterandMechanismLv1(3, '#cn_cusTypeName');
});
// 获取拆分关键字等信息
function loadMappingInfo(srcCusName) {
    $.tAjax('/api/service/interfaceInfo', {srcCusName: srcCusName}).success(function (res) {
        if (res.chaifen) { // 关键字
            $("#c_pname").text(res.chaifen_pname?res.chaifen_pname:''); // 省
            $("#c_cityname").text(res.chaifen_cityname?res.chaifen_cityname:''); // 市
            // $("#c_address").text(res.chaifen_address); // 详细地址
            $("#c_adname").text(res.chaifen_attr?res.chaifen_attr:'');
            $("#c_keyWord").text(res.chaifen_keyWord?res.chaifen_keyWord:''); // 关键字
        }
        if (res.gaode) { // 高德
            $("#gaode_pname").text(res.gaode_pname?res.gaode_pname:''); // 省
            $("#gaode_cityname").text(res.gaode_cityname?res.gaode_cityname:''); // 市
            $("#gaode_adname").text(res.gaode_adname?res.gaode_adname:''); // 区域
            $("#gaode_address").text(res.gaode_address?res.gaode_address:''); // 详细地址
            $("#gaode_name").text(res.gaode_name?res.gaode_name:'') // 高德中对应名字
        }
        searchCusList('load');
    });

    // 清空3个搜索自填项
    resetSearch();
    loadProvince("#p_pname");
}
// 清空查询
function resetSearch() {
    $("#p_pname").val('');
    $("#p_cityname").val('');
    $("#p_pname").trigger("chosen:updated");
    $("#p_cityname").trigger("chosen:updated");
    $("#p_adname").val('');
}
// modle 保存mapping按钮
function submitModle() {
    if (($("#modle_mappingSetting").jqGrid('getRowData')).length<= 0) {
        layer.msg('请匹配未mapping数据后进行保存');
        return;
    }
    var srcCusName = $("#customerMapping-modal").attr("srcCusName");
    var source = $("#customerMapping-modal").attr("source");

    if ($("#customerMapping-modal").attr("effectFlag") === '1') { // 更新
        // 区分特殊转特殊、共通转共通  共通转特殊
        var oldData = JSON.parse($("#updateInfoDom").attr('info'));
        var parms = {};
        var goSubmit = function (parms) {
            $.tAjax('/api/service/updateCustomerMapping', parms).success(function (res) {
                if (res.success) {
                    layer.msg('保存成功！');
                } else {
                    layer.msg(res.msg);
                }
                $('#customerMapping-modal').modal('hide');
                loadTable();
            });
        };
        // if (oldData.typeFlag === '1') { // get:1共通，2特殊  send:1共通，2特殊，3共通转特殊
        //     // 只要是共通，改变需要重新遍历确认
        //     var data = ifCommon().data;
        //     if (ifCommon().ifCommon) {
        //         layer.confirm('为该原始数据创建共通Mapping还是特殊Mapping？', {
        //             btn: ['共通', '特殊'] //按钮
        //         }, function () { // btn 共通
        //             parms = {// 共通更新成共通
        //                 id: oldData.id,
        //                 ysID: data[0].ysID,
        //                 dealerCode: oldData.dealerCode,
        //                 province: oldData.province,
        //                 city: oldData.city,
        //                 typeFlag: oldData.typeFlag
        //             }
        //             goSubmit(parms);
        //         }, function () { // btn 特殊
        //             parms = {
        //                 id: oldData.id,
        //                 typeFlag: 3,
        //                 srcCusName: srcCusName,
        //                 data: data
        //             }
        //             goSubmit(parms);
        //         });
        //
        //     } else {// 共通更新成特殊
        //         parms = {
        //             id: oldData.id,
        //             typeFlag: 3,
        //             srcCusName: srcCusName,
        //             data: data
        //         }
        //         goSubmit(parms);
        //     }
        // } else { // 特殊更新成特殊
        //     var rowID = $('#modle_cusList').jqGrid('getGridParam', 'selarrrow');
        //     var rowData = $("#modle_cusList").jqGrid('getRowData', rowID);
        //     parms = {
        //         id: oldData.id,
        //         ysID: rowData.ysID,
        //         dealerCode: oldData.dealerCode,
        //         province: oldData.province,
        //         city: oldData.city,
        //         typeFlag: oldData.typeFlag
        //     }
        //     goSubmit(parms);
        // }

        var rowID = $('#modle_cusList').jqGrid('getGridParam', 'selarrrow');
        var rowData = $("#modle_cusList").jqGrid('getRowData', rowID);
        parms = {
            id: oldData.id,
            ysID: rowData.ysID,
            dealerCode: oldData.dealerCode,
            province: oldData.province,
            city: oldData.city,
            typeFlag: oldData.typeFlag
        };
        goSubmit(parms);

    } else if ($("#customerMapping-modal").attr("effectFlag") === '2') { // 新增
        var data = ifCommon().data;
        if (ifCommon().ifCommon) { // 选择都一样，询问创建共通还是特殊
            layer.confirm('为该原始数据创建共通Mapping还是特殊Mapping？', {
                btn: ['共通', '特殊'] //按钮
            }, function () { // btn 共通
                $.tAjax('/api/service/insertCustomerMapping', {
                    typeFlag: 1,
                    srcCusName: srcCusName,
                    ysID: data[0].ysID,
                    source:source
                }).success(function (res) {
                    if (res.success) {
                        layer.msg(res.msg)
                    } else {
                        layer.msg(res.msg);
                    }
                    $('#customerMapping-modal').modal('hide');
                    loadTable();
                });
            }, function () { // btn 特殊
                $.tAjax('/api/service/insertCustomerMapping', {
                    typeFlag: 2,
                    srcCusName: srcCusName,
                    source:source,
                    data: data
                }).success(function (res) {
                    if (res.success) {
                        layer.msg(res.msg);
                    } else {
                        layer.msg(res.msg);
                    }
                    $('#customerMapping-modal').modal('hide');
                    loadTable();
                });
            });

        } else { // 创建特殊
            layer.confirm('是否根据经销商省市创建特殊Mapping？', {
                btn: ['是', '否'] //按钮
            }, function () { // btn 是
                $.tAjax('/api/service/insertCustomerMapping', {
                    typeFlag: 2,
                    srcCusName: srcCusName,
                    source:source,
                    data: data
                }).success(function (res) {
                    if (res.success) {
                        layer.msg('保存成功！');
                    } else {
                        layer.msg(res.msg);
                    }
                    $('#customerMapping-modal').modal('hide');
                    loadTable();
                });
            }, function () {
            });
        }
    }
}

// 使用预匹配数据判断创建共通还是特殊
function ifCommon() {
    var tableData = $("#modle_mappingSetting").jqGrid('getRowData');
    var data = [];
    var ifCommon = true;
    tableData.forEach(function (rowData, index) {
        var dataObj = {
            srcDealerCode: rowData.srcDealerCode,
            provinceCode: rowData.provinceCode,
            cityCode: rowData.cityCode,
            ysID: rowData.ysID
        };
        data.push(dataObj);
        if (index > 0 && rowData.ysID !== tableData[index - 1].ysID) {
            ifCommon = false;
        }
    });
    return {data: data, ifCommon: ifCommon};
}

// modle 查询标准list
function searchCusList() {
    layer.load(1);
    var searchCondition = {};
    searchCondition.province = $("#p_pname").val() ? $("#p_pname").val() : '';
    searchCondition.city = $("#p_cityname").val() ? $("#p_cityname").val() : '';
    searchCondition.cusName = $("#p_adname").val() ? $("#p_adname").val() : '';
    searchCondition.searchProvName = $("#c_pname").text() ? $("#c_pname").text() : ($("#gaode_pname").text() ? $("#gaode_pname").text() : '');
    searchCondition.searchCityName = $("#c_cityname").text() ? $("#c_cityname").text() : ($("#gaode_cityname").text() ? $("#gaode_cityname").text() : '');
    searchCondition.searchName = $("#c_keyWord").text() ? $("#c_keyWord").text() : '';
    searchCondition.searchAttr = $("#chaifen_attr").text() ? $("#chaifen_attr").text() : '';
    if ($("#modle_cusList").html() !== '') {
        // 清除原有postData,防止累加
        var postDataOld = $('#modle_cusList').jqGrid("getGridParam", "postData");
        $.each(postDataOld, function (k, v) {
            delete postDataOld[k];
        });
        var postData;
        if (arguments[0]) { // 每次点开modle时，都要按特殊规则进行查询，此时传一个参数作为区分
            postData = {
                searchProvName: searchCondition.searchProvName,
                searchCityName: searchCondition.searchCityName,
                searchName: searchCondition.searchName,
                searchAttr: searchCondition.searchAttr
            };
        } else {
            postData = {
                province: searchCondition.province,
                city: searchCondition.city,
                cusName: searchCondition.cusName
            }
        }
        $("#modle_cusList").jqGrid("clearGridData");
        $("#modle_cusList").jqGrid('setGridParam', {
            postData: postData
        }).trigger('reloadGrid');
    } else {
        var postData = {
            searchProvName: searchCondition.searchProvName,
            searchCityName: searchCondition.searchCityName,
            searchName: searchCondition.searchName,
            searchAttr: searchCondition.searchAttr
        };
        var obj = {
            url: '/api/service/searchCustomerMaster',
            postData: postData,
            colModel: [
                {name: 'medicalOrgName', index: 'medicalOrgName', width: 180, label: '标准客户名'},
                {
                    name: 'provinceName',
                    index: 'provinceName',
                    width: 80,
                    label: '省'
                },
                {
                    name: 'cityName',
                    index: 'cityName',
                    width: 80,
                    label: '市'
                }, {
                    name: 'ysID',
                    index: 'ysID',
                    hidden: true
                },{
                    name: 'showdetail', index: 'showdetail', width: 100, label: '操作',sortable: false,
                    formatter: function (cellvalue, options, rowObject) {
                        return "<button class='btn btn-primary btn-sm' onclick='showDetailInfo("
                            + JSON.stringify(rowObject) + ")'>" + "详细" + "</button>";
                    }
                }
            ],
            pager: "#modle_cusList_page",
            gridComplete: function () { // 隐藏全选
                $("#cb_modle_cusList").hide();
                return (true);
            },
            beforeSelectRow: function () { // hack成单选
                $("#modle_cusList").jqGrid('resetSelection');
                return (true);
            },
            loadComplete: function () {
                var table = this;
                setTimeout(function () {
                    $.fn.jqGridFn().updatePagerIcons(table);
                    $.fn.jqGridFn().enableTooltips(table);
                }, 0);
                layer.closeAll('loading');
            },
            loadui: 'block'
        };
        $("#modle_cusList").drawTable(obj);
    }
    setTimeout(function () {
        $("#modle_cusList").resize();
    }, 250);
}

// 标准终端，查看详细信息
function showDetailInfo(rowData) {
    $.tAjax('/api/service/searchMasterDataForYsId',{ysID:rowData.ysID}).success(function (res) {
        editMasterData(res.list);
        $("#modal_title").text('查看主数据详细信息');
        $(".modal-backdrop").eq(1).css('z-index', 1057);
    });
}

// 加载未mapping table
function loadModleMapping(srcCusName) {
    if ($("#modle_mappingList").html() !== '') {
        $("#modle_mappingList").jqGrid("clearGridData");
        $("#modle_mappingList").jqGrid('setGridParam', {postData: {srcCusName: srcCusName}}).trigger('reloadGrid');
    } else {
        var obj = {
            url: '/api/service/searchSrcCustomer',
            postData: {
                srcCusName: srcCusName
            },
            colModel: [
                {name: 'uuid', index: 'uuid', hidden: true, key: true, label: '假主键'},
                {name: 'srcCusName', index: 'srcCusName', width: 180, label: '原始客户名'},
                {
                    name: 'srcDealerName',
                    index: 'srcDealerName',
                    width: 160,
                    label: '经销商'
                },
                {
                    name: 'provinceName',
                    index: 'provinceName',
                    width: 80,
                    label: '省'
                },
                {
                    name: 'cityName',
                    index: 'cityName',
                    width: 80,
                    label: '市'
                }, {
                    name: 'srcDealerCode',
                    index: 'srcDealerCode',
                    hidden: true
                }, {
                    name: 'provinceCode',
                    index: 'provinceCode',
                    hidden: true
                }, {
                    name: 'cityCode',
                    index: 'cityCode',
                    hidden: true
                }
            ],
            pager: "#modle_mappingList_page",
            multiselect: true,
            loadComplete: function () {
                var table = this;
                setTimeout(function () {
                    $.fn.jqGridFn().updatePagerIcons(table);
                    $.fn.jqGridFn().enableTooltips(table);
                }, 0);
                $("#cb_modle_mappingList").trigger('click');
            }
        };
        $("#modle_mappingList").drawTable(obj);
    }
    setTimeout(function () {
        $("#modle_mappingList").resize();
    }, 250);
    $("#customerMapping-modal").attr("srcCusName", srcCusName);
}

// 加载需更新 table
function loadUpdateMapping(id) {
    // $("#mappingList_box") 未mapping   $("#mappingSetting_box") Mapping列表
    $.tAjax('/api/service/queryOneMapping', {id: id}).success(function (res) {
        if (res.success) {
            $("#updateInfoDom").attr('info', JSON.stringify(res.list[0])); // 存储更新原数据
            // if (res.list[0].typeFlag === '1') { // 共通，依然给用户显示原始名未mapping列表
            //     loadModleMapping(res.list[0].srcCusName);
            //     $("#mappingList_box").show(); // 显示待mapping数据
            //     $("#customerMapping-modal").attr("typeFlag", 1); // 标记，用于判断新匹配时是否删除原有匹配数据
            // }
            drawMappingSetting(res.list);// 直接将需更新的数据放置在已匹配的table中
        }
    });
}

// 设置匹配关系
function setMapping() {
    var idCArr = $('#modle_cusList').jqGrid('getGridParam', 'selarrrow'); // 标准客户列表选择项
    if ((!idCArr || idCArr.length === 0 || !idCArr.length) && !arguments[0]) { // 未选择标准客户名时不予匹配
        layer.msg('请选择标准客户名后进行匹配！');
        return;
    }
    var idMArr = $('#modle_mappingList').jqGrid('getGridParam', 'selarrrow'); // 待匹配选择项 可能多项
    if(!idMArr || idMArr.length==0 || !idMArr.length){ // 未选择待匹配项
        layer.msg('请选择待客户名后进行匹配！');
        return;
    }
    if ($("#customerMapping-modal").attr("typeFlag") === '1') { // 如果是共通mapping，重新匹配时要清空原共通数据
        $("#modle_mappingSetting").jqGrid("clearGridData"); // 清空mapping列表
        $("#customerMapping-modal").removeAttr("typeFlag");
        // $("#modle_mappingSetting").setGridParam().showCol("return").trigger("reloadGrid");
        // $("#modle_mappingSetting").resize();    有bug，先显示了取消按钮，但是会后加载表头覆盖掉了
    }

    var c_rowData = $("#modle_cusList").jqGrid('getRowData', idCArr); // 选择的标准客户数据
    if (arguments[0]) { // 如果有参数，使用参数中的值，无视标准客户列表中的选项
        c_rowData = arguments[0];
    }
    var mapData = [];
    idMArr.forEach(function (rowId) {
        var rowData = $("#modle_mappingList").jqGrid('getRowData', rowId);
        var dataObj = {
            srcCusName: rowData.srcCusName,
            srcDealerCode: rowData.srcDealerCode,
            srcDealerName: rowData.srcDealerName,
            provinceCode: rowData.provinceCode,
            provinceName: rowData.provinceName,
            cityCode: rowData.cityCode,
            cityName: rowData.cityName,
            medicalOrgName: c_rowData.medicalOrgName,
            ysID: c_rowData.ysID
        };
        mapData.push(dataObj);
    });
    drawMappingSetting(mapData);
    var len = idMArr.length;
    for (var i = 0; i < len; i++) { // 匹配关系进入下方时，不应再出现在这个表中
        $("#modle_mappingList").jqGrid("delRowData", idMArr[0]); // 删除已匹配上的数据行
    }
}

// 显示匹配关系tabel
function drawMappingSetting(tableData) {
    if ($("#modle_mappingSetting").html() !== '') {
        $("#modle_mappingSetting").jqGrid('addRowData', $("#modle_mappingSetting").getGridParam("reccount"), tableData);
        if ($("#updateInfoDom").attr('info')) {
            ifCancelShow();
        }
    } else {
        var colRight = [
            {name: 'srcCusName', index: 'srcCusName', width: 250, label: '原始客户名'},
            {name: 'medicalOrgName', index: 'medicalOrgName', width: 180, label: '标准客户名'},
            {
                name: 'srcDealerName',
                index: 'srcDealerName',
                width: 160,
                label: '经销商'
            },
            {
                name: 'provinceName',
                index: 'provinceName',
                width: 80,
                label: '省'
            },
            {
                name: 'cityName',
                index: 'cityName',
                width: 80,
                label: '市'
            }, {
                name: 'srcDealerCode',
                index: 'srcDealerCode',
                hidden: true
            }, {
                name: 'provinceCode',
                index: 'provinceCode',
                hidden: true
            }, {
                name: 'cityCode',
                index: 'cityCode',
                hidden: true
            }, {
                name: 'ysID',
                index: 'ysID',
                hidden: true
            }, {
                name: 'return', index: 'return', width: 60, label: '操作',sortable: false,
                formatter: function (cellvalue, options, rowObject) {
                    return "<button class='btn btn-primary btn-sm' onclick='cancelMapping(" + JSON.stringify(options) + ")'>" + "取消" + "</button>";
                }
            }
        ];
        var obj_left = {
            data: tableData,
            colModel: colRight,
            datatype: "local",
            multiselect: false
        };
        $("#modle_mappingSetting").drawTable(obj_left);
        if ($("#updateInfoDom").attr('info')) {
            ifCancelShow();
        }
    }
}

// 判断是否显示取消按钮
function ifCancelShow() {
    var oldData = JSON.parse($("#updateInfoDom").attr('info'));
    if (oldData) {
        $("#modle_mappingSetting").setGridParam().hideCol("return").trigger("reloadGrid");
    } else {
        $("#modle_mappingSetting").setGridParam().showCol("return").trigger("reloadGrid");
    }
    setTimeout(function () {
        $("#modle_mappingSetting").resize();
    }, 50);
}

// 在预mapping表中退回Mapping操作
function cancelMapping(rowOptions) {
    var rowId = rowOptions.rowId;
    var rowData = $("#modle_mappingSetting").jqGrid('getRowData', rowId);
    $("#modle_mappingList").jqGrid('addRowData', $("#modle_mappingList").getGridParam("reccount"), rowData); // 恢复未匹配数据
    $("#modle_mappingSetting").jqGrid("delRowData", rowId); // 删除已匹配上的数据行
}

// 新建临时主数据 标准数据中没有匹配项时
function newMapping() {
    // 判断是否选择了未mapping中的数据，只有选择了未mapping数据才可以创建临时主数据
    var idArr = $('#modle_mappingList').jqGrid('getGridParam', 'selarrrow');
    if (idArr.length === 0) {
        layer.msg('请选择要创建临时主数据的原始数据后再创建临时主数据');
        return;
    }
    layer.confirm('是否根据经销商省市创建临时主数据？', {
        btn: ['是', '否'] //按钮
    }, function (index) { // btn 是
        layer.close(index);
        var reginData = $("#modle_mappingList").jqGrid('getRowData', idArr[0]);// 省市信息默认取下方选取的未Mapping数据的第一条
        $("#medicalOrgName").val('');// 清空【标准客户名】项
        $('#createMD-modal').modal('show');
        $(".modal-backdrop").eq(1).css('z-index', 1059);
        // 获取省信息
        loadProvince('#province').success(function () {
            $("#province").val(reginData.provinceCode);
            $("#province").trigger("chosen:updated");
            loadCity('#province','#city').success(function () {
                $("#city").val(reginData.cityCode);
                $("#city").trigger("chosen:updated");
            });
        });
        $('#cn_medicalOrgLevel').val('');
        $("#cn_medicalOrgLevel").trigger("chosen:updated");
        $('#cn_medicalOrgGrade').val('');
        $("#cn_medicalOrgGrade").trigger("chosen:updated");
        $('#cn_mechanismLev1').val('');
        $("#cn_mechanismLev1").trigger("chosen:updated");
        $('#cn_mechanismLev2').val('');
        $("#cn_mechanismLev2").trigger("chosen:updated");
        $('#cn_mechanismLev3').val('');
        $("#cn_mechanismLev3").trigger("chosen:updated");
        $('#cn_cusTypeName').val('');
        $("#cn_cusTypeName").trigger("chosen:updated");

    });
}

// 新建临时主数据 保存按钮
function saveTemporaryMD() {
    var medicalOrgName = $('#medicalOrgName').val();
    var provinceCode = $('#province').val();
    var provinceName = $('#province option:selected').text();
    var cityCode = $('#city').val();
    var cityName = $('#city option:selected').text();
    if($('#cn_cusTypeName').val()=='' || $('#cn_cusTypeName').val()==null){
        layer.msg('请选择终端类型');
        return;
    }
    if(medicalOrgName!=='' && provinceCode!='' && provinceCode!='-1' && provinceCode!=null && cityCode!='' && cityCode!='-1' && cityCode!=null){
        var param = {
            medicalOrgName: medicalOrgName,
            provinceCode: provinceCode,
            provinceName:provinceName,
            cityCode: cityCode,
            cityName:cityName,
            medicalOrgLevel: $("#cn_medicalOrgLevel").val() ? $("#cn_medicalOrgLevel option:selected").text() : '',
            medicalOrgLevelCode: $("#cn_medicalOrgLevel").val() ? $("#cn_medicalOrgLevel").val() : '',
            medicalOrgGrade: $("#cn_medicalOrgGrade").val() ? $("#cn_medicalOrgGrade option:selected").text() : '',
            medicalOrgGradeCode: $("#cn_medicalOrgGrade").val() ? $("#cn_medicalOrgGrade").val() : '',
            mechanismLev1: $("#cn_mechanismLev1").val() ? $("#cn_mechanismLev1 option:selected").text() : '',
            mechanismLev1Code: $("#cn_mechanismLev1").val() ? $("#cn_mechanismLev1").val() : '',
            mechanismLev2: $("#cn_mechanismLev2").val() ? $("#cn_mechanismLev2 option:selected").text() : '',
            mechanismLev2Code: $("#cn_mechanismLev2").val() ? $("#cn_mechanismLev2").val() : '',
            mechanismLev3: $("#cn_mechanismLev3").val() ? $("#cn_mechanismLev3 option:selected").text() : '',
            mechanismLev3Code: $("#cn_mechanismLev3").val() ? $("#cn_mechanismLev3").val() : '',
            cusTypeName:$('#cn_cusTypeName').val()?$('#cn_cusTypeName option:selected').text():'',
            cusTypeCode:$('#cn_cusTypeName').val()?$('#cn_cusTypeName').val():''
        };
        $.tAjax('/api/service/insertTemporaryData', param).success(function (res) {
            if (res.success) {
                layer.msg(res.msg);
                setMapping(res);
                $('#createMD-modal').modal('hide');
            } else {
                layer.msg(res.msg);
            }
        });
    }else {
        layer.msg('请填入标准客户名及省市信息后进行保存');
    }
}

// modle关闭提醒
function closeTips() {
    layer.confirm('是否放弃所有已编辑数据并离开操作页面？', {
        btn: ['否', '是'] //按钮
    }, function (index) { // btn 否
        layer.close(index);
    }, function () { // btn 是
        $("#customerMapping-modal").modal('hide');
    });
}

// 百度查询
function searchBaidu() {
    var urlStr = 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=' + $("#modle_srcCusName").text();
    //iframe窗
    layer.open({
        type: 2,
        title: '百度搜索原始客户名',
        shadeClose: false,
        shade: false,
        maxmin: true, //开启最大化最小化按钮
        area: ['65%', '80%'],
        offset: 'auto', //右下角弹出
        content: [urlStr, 'yes'] //iframe的url，no代表不显示滚动条
    });
}

