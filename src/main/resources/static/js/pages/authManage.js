$(function () {
    $("#tabs").tabs();
    loadProvince('#nc_province');
    $("#authDealerTable").tableResize();
    $("#authListTable").tableResize();
    // 修正第二个modle关闭引发的scroll表现不正确的Bug
    $('#authInfo-modal').on('hide.bs.modal', function () {
        setTimeout(function () {
            $('body').addClass('modal-open');
        }, 510);
    });
});

// 弹出编辑个人权限modal
function editPersonAuth(rowData) {
    $('#personAuth-modal').attr('userCode', rowData['userCode']);
    $('#limit_switch').prop('checked', rowData['isQueryAll'] === 1);
    loadAuthListByPerson();
    $('#personAuth-modal').modal('show');
    setTimeout(function () {
        $("#authListTable").resize();
    }, 250);
}


// 获取当前被编辑用户的权限列表
function loadAuthListByPerson() {
    var params = {
        userCode: $('#personAuth-modal').attr('userCode')
    };
    if ($("#authListTable").html() !== '') {
        $("#authListTable").jqGrid("clearGridData");
        $("#authListTable").jqGrid('setGridParam', {
            postData: params
        }).trigger('reloadGrid');
    } else {
        var obj = {
            url: '/api/auth/getAuthorityByUser',
            colModel: [
                {
                    name: 'authorityName',
                    index: 'authorityName',
                    width: 160,
                    label: '权限名',
                    // formatter: function (cellvalue, options, rowObject) {
                    //
                    //     return '权限' + (Number(options.rowId) + ($("#authListTable").jqGrid('getGridParam', 'page') - 1) * $("#authListTable").jqGrid('getGridParam', 'rowNum'));
                    // }
                },
                {name: 'dealerNamePreview', index: 'provinceName', width: 120, label: '经销商'},
                {name: 'productNamePreview', index: 'dealerName', width: 200, label: '产品（组）'},
                {name: 'regionNamePreview', index: 'cityName', width: 120, label: '终端省/市'},
                {name: 'dealerCode', index: 'dealerCode', label: '经销商编码组', hidden: true},
                {name: 'dealerNamePreview', index: 'dealerNamePreview', label: '经销商text', hidden: true},
                {name: 'productCode', index: 'productCode', label: '产品编码组', hidden: true},
                {name: 'regionCode', index: 'regionCode', label: '终端省/市编码组', hidden: true},
                {
                    name: 'doSth', index: 'doSth', width: 160, label: '操作', sortable: false, align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        var str = '';
                        if($('#authInfo-modal').attr('editFlag')==='true'){
                            str = "<button class='btn btn-primary btn-sm' onclick='editOneAuth(" + JSON.stringify(rowObject) + ")'>" + "编辑" + "</button>" +
                            "<button class='btn btn-clear btn-sm' onclick='deleteOneAuth(" + JSON.stringify(rowObject) + ")'>" + "删除" + "</button>";
                        }else {
                            str = "<button class='btn btn-primary btn-sm' onclick='editOneAuth(" + JSON.stringify(rowObject) + ")'>" + "查看" + "</button>"
                        }
                        return str;
                    }
                }
            ],
            rowNum: 10,
            pager: "#authListTable-pager",
            multiselect: false,
            postData: params,
            loadComplete: function (res) {
                $("#authListTable").attr('totalCount',res.totalCount);
                var table = this;
                setTimeout(function () {
                    // styleCheckbox(table);
                    // updateActionIcons(table);
                    $.fn.jqGridFn().updatePagerIcons(table);
                    $.fn.jqGridFn().enableTooltips(table);
                }, 0);
                layer.closeAll('loading');
            }
        };
        $("#authListTable").drawTable(obj);
        $("#authListTable").closest(".ui-jqgrid-bdiv").css({"overflow-x": "scroll"});
    }
}

// 新增单条权限
function newOneAuth() {
    loadAllProductAndRegionInfo().success(function () {
        // 重置内容
        resetAuth();
        loadDealerCheckTable();
        $('#a_authorityName').val('权限' +( Number($("#authListTable").attr('totalCount')) + 1));
        $('#authInfo-modal').attr('newFlag', true);
        $('#authInfo-modal').removeAttr('authorityId');
        $('#authInfo-modal').modal('show');
        setTimeout(function () {
            $("#authDealerTable").resize();
        }, 250);
        $(".modal-backdrop").eq(1).css('z-index', 1059);
    });

}


// 编辑单条权限
function editOneAuth(rowData) {
    loadAllProductAndRegionInfo().success(function () {
        resetAuth();
        $('#a_authorityName').val(rowData.authorityName);
        $('#authInfo-modal').attr('newFlag', false);
        $('#authInfo-modal').attr('authorityId', rowData.authorityId);
        if (rowData.isAllDealer===1) {
            $('#chooseAllDealerBtn').trigger('click');
        }
        if (rowData.isAllProduct===1) {
            $('#chooseAllProductBtn').trigger('click');
        }
        if (rowData.isAllRegion===1) {
            $('#chooseAllRegionBtn').trigger('click');
        }
        drawChecked(rowData.productCode, rowData.regionCode);
        updateInfoText('checkBoxGroup_product');
        updateInfoText('checkBoxGroup_region');
        // 注意补充dealerCode信息组
        dealerCodeGroup = rowData.userAuthDealer;
        // 名字对照在表格渲染处赋值了，如果当前页选择了，那里会再次更新text,如果当前页没有勾选，使用已存
        // dealerCodeGroupObj = {};
        $('#a_dealerCodeGroupText').val(rowData.dealerNamePreview);
        loadDealerCheckTable();
        $('#authInfo-modal').modal('show');
        setTimeout(function () {
            $("#authDealerTable").resize();
        }, 250);
        $(".modal-backdrop").eq(1).css('z-index', 1059);
    });
}

// 重置权限
function resetAuth() {
    resetAuthDealerSearch();
    $('#a_dealerCodeGroupText').val('');
    $('#a_productCodeGroupText').val('');
    $('#a_regionGroupText').val('');
    $('#a_authorityName').val('');
    $('#tabs').tabs( "option", "active", 0 );
    $('#chooseAllDealerBtn').attr('flag', 'chooseAll');
    $('#chooseAllDealerBtn').text('全部选择');
    $('#chooseAllProductBtn').attr('flag', 'chooseAll');
    $('#chooseAllProductBtn').text('全部选择');
    $('#chooseAllRegionBtn').attr('flag', 'chooseAll');
    $('#chooseAllRegionBtn').text('全部选择');
    $(".checkGroup input[type='checkbox']").prop('checked', false);
    $('#authDealerBox').slideDown();
    dealerCodeGroup = [];
    dealerCodeGroupObj = {};
    dealerAll = 0;
}


// 赋值渲染勾选状态,2个维度共通
function drawChecked(productStr, regionStr) {
    var productArr = productStr ? productStr.split(',') : [];
    var regionArr = regionStr ? regionStr.split(',') : [];

    var parentProductArr = [];
    productArr.forEach(function (item) {
        $('#checkBoxGroup_product input[name="child"][value=' + item + ']').prop('checked', true);
        var parentCode = $('#checkBoxGroup_product input[name="child"][value=' + item + ']').attr('parcode').replace('p', '');
        if ($.inArray(parentCode, parentProductArr) == -1) {
            parentProductArr.push(parentCode);
        }
    });
    // 处理parent全选状态
    parentProductArr.forEach(function (it) {
        if ($("#checkBoxGroup_product input[name='child'][parCode=p" + it + "]:checked").length === $("#checkBoxGroup_product input[name='child'][parCode=p" + it + "]").length) {
            $("#checkBoxGroup_product input[name='parent'][value=" + it + "]").addClass('isDrawing');
            $("#checkBoxGroup_product input[name='parent'][value=" + it + "]").prop('checked', true);
            $("#checkBoxGroup_product input[name='parent'][value=" + it + "]").removeClass('isDrawing');
        }
    });

    var regionProductArr = [];
    regionArr.forEach(function (item) {
        $('#checkBoxGroup_region input[name="child"][value=' + item + ']').prop('checked', true);
        var parentCode = $('#checkBoxGroup_region input[name="child"][value=' + item + ']').attr('parcode').replace('p', '');
        if ($.inArray(parentCode, regionProductArr) == -1) {
            regionProductArr.push(parentCode);
        }
    });
    // 处理parent全选状态
    regionProductArr.forEach(function (it) {
        if ($("#checkBoxGroup_region input[name='child'][parCode=p" + it + "]:checked").length === $("#checkBoxGroup_region input[name='child'][parCode=p" + it + "]").length) {
            $("#checkBoxGroup_region input[name='parent'][value=" + it + "]").addClass('isDrawing');
            $("#checkBoxGroup_region input[name='parent'][value=" + it + "]").prop('checked', true);
            $("#checkBoxGroup_region input[name='parent'][value=" + it + "]").removeClass('isDrawing');
        }
    });
    // 处理disable
    if($('#authInfo-modal').attr('editFlag')!=='true'){
        $('#authInfo-modal input[type="checkbox"]').attr('disabled','disabled');
    }else {
        $('#authInfo-modal input[type="checkbox"]').removeAttr('disabled');
    }
}

// 删除单条权限
function deleteOneAuth(rowData) {
    layer.confirm('是否确认删除该条权限？', {
        btn: ['是', '否'] //按钮
    }, function (index) { // btn 是
        layer.close(index);
        var params = {
            authorityId: rowData.authorityId
        };
        $.tAjax('/api/auth/deleteUserAuthorityByID', params).success(function (res) {
            if (res.success) {
                layer.msg('删除成功');
                loadAuthListByPerson();
            } else {
                layer.msg(res.msg);
            }
        });
    });
}

// 更改不设限状态
function changeLimit(that) {
    var params = {
        userCode: $('#personAuth-modal').attr('userCode'),
        state: $(that).get(0).checked ? '1' : '0'// 不受限是1，受限是0,但是触发时间早于值变动时间，所以取值反过来
    };
    $.tAjax('/api/auth/updateUserQueryState', params).success(function (res) {
        if (res.success) {
            layer.msg('状态变更成功');
            updateCallback0();
        } else {
            layer.msg(res.msg);
        }
    });
}

// resize table,tab切换用
function doResize() {
    setTimeout(function () {
        $("#authDealerTable").resize();
    }, 150)
}

// 保存单条权限
function submitOneAuth() {
    // dealer组
    var isAllDealer = dealerAll;// 需要做处理，用户全选之后，取消勾选控制不住，最好有个总个数的比较
    var dealerRes = dealerCodeGroup;
    if (dealerAll===1) {
        dealerRes = [];
    }
    // 产品组
    var productRes = [];
    var isAllProduct = 1;// 0 空，1 全选 ，2 部分
    if ($("#checkBoxGroup_product input[name='child']:checked").length !== $("#checkBoxGroup_product input[name='child']").length) {// 非全选
        $("#checkBoxGroup_product input[name='child']:checked").each(function () {
            productRes.push($(this).val());
        });
        if($("#checkBoxGroup_product input[name='child']:checked").length===0){// 空
            isAllProduct = 0;
        }else {// 部分
            isAllProduct = 2;
        }
    }
    // 省市组
    var regionRes = [];
    var isAllRegion = 1;
    if ($("#checkBoxGroup_region input[name='child']:checked").length !== $("#checkBoxGroup_region input[name='child']").length) {// 全部时，传''
        $("#checkBoxGroup_region input[name='child']:checked").each(function () {
            regionRes.push($(this).val());
        });

        if($("#checkBoxGroup_region input[name='child']:checked").length===0){
            isAllRegion = 0;
        }else {
            isAllRegion = 2;
        }
    }
    var valid = true;
    if ((dealerRes.length === 0 && isAllDealer === 0) && (productRes.length === 0 && isAllProduct === 0) && (regionRes.length === 0 && isAllRegion === 0)) {
        valid = false;
        layer.msg('权限3个维度不可全为空');
        return;
    }
    var authorityName = $('#a_authorityName').val();
    if(authorityName==='' || authorityName===null){
        valid = false;
        layer.msg('权限名称不可为空');
        return;
    }
    if (valid) {
        layer.load(1);
        var params = {
            authorityId: $('#authInfo-modal').attr('newFlag') === 'true' ? '' : $('#authInfo-modal').attr('authorityId'),
            userCode: $('#personAuth-modal').attr('userCode'),
            dealerCode: dealerRes.join(','),
            dealerNamePreview: $("#a_dealerCodeGroupText").val(),
            isAllDealer: isAllDealer,// 待替换
            productCode: productRes.join(','),
            productNamePreview: $('#a_productCodeGroupText').val(),
            isAllProduct: isAllProduct,
            regionCode: regionRes.join(','),
            regionNamePreview: $('#a_regionGroupText').val(),
            isAllRegion: isAllRegion,
            authorityName:authorityName
        };
        $.tAjax('/api/auth/saveUserAuthorityInfo', params).success(function (res) {
            layer.closeAll('loading');
            if (res.success) {
                layer.msg('保存成功');
                $('#authInfo-modal').modal('hide');
                loadAuthListByPerson();
            } else {
                layer.msg(res.msg);
            }
        });
    }
}


// 加载经销商表格
var dealerCodeGroup = [];// 全局变量，存储用户已选择经销商信息
var dealerCodeGroupObj = {};
var dealerAll = 0;// 是否全选
var dealerTableLoading = false;
function loadDealerCheckTable() {
    dealerTableLoading = true;
    var params = {
        provinceCode: $('#nc_province').val() ? $('#nc_province').val() : '',
        cityCode: $('#nc_city').val() ? $('#nc_city').val() : '',
        dealerName: $("#nc_dealerName").val() ? $("#nc_dealerName").val() : '',
        dealerCodeGroup: dealerCodeGroup.join(','),
        dealerCheck: $('#nc_status').val()// 0:未选择的经销商，1：已选择的经销商，其他不管传啥都是全部
    };
    if ($("#authDealerTable").html() !== '') {
        $("#authDealerTable").jqGrid("clearGridData");
        $("#authDealerTable").jqGrid('setGridParam',
            {
                postData: params
            }).trigger('reloadGrid');
    } else {
        var obj = {
            url: '/api/auth/searchDealerInfo',
            colModel: [
                {name: 'dealerName', index: 'dealerName', width: 200, label: '经销商名称'},
                {name: 'dealerCode', index: 'dealerCode', width: 200, label: '经销商编码', hidden: true},
                {name: 'provinceName', index: 'provinceName', width: 120, label: '经销商省'},
                {name: 'cityName', index: 'cityName', width: 120, label: '经销商市'},
                {name: 'districtName', index: 'districtName', width: 120, label: '经销商区'},
                {name: 'detailAddress', index: 'detailAddress', width: 120, label: '经销商地址'},
                {name: 'provinceCode', index: 'provinceCode', width: 120, label: '经销商省编码', hidden: true},
                {name: 'cityCode', index: 'cityCode', width: 120, label: '经销商市编码', hidden: true},
                {name: 'districtCode', index: 'districtCode', width: 120, label: '经销商区编码', hidden: true},
                {name: 'dealerTotal', index: 'dealerTotal', width: 120, label: '经销商总量判断用', hidden: true}
            ],
            rowNum: 10,
            pager: "#authDealerTable-pager",
            postData: params,
            onSelectAll: function (aRowids, status) { // 单页全选事件
                aRowids.forEach(function (id) {
                    var rowData = $("#authDealerTable").jqGrid('getRowData', id);
                    dealerResChange(rowData, status);
                });
            },
            onSelectRow: function (rowid, status) {
                var rowData = $("#authDealerTable").jqGrid('getRowData', rowid);
                dealerResChange(rowData, status);
            },
            gridComplete: function () {
                if (dealerAll===1) {
                    var rows = $("#authDealerTable").jqGrid('getRowData');
                    rows.forEach(function (itRow, id) {
                        $("#authDealerTable").jqGrid('setSelection', id + 1, true);
                    });
                } else {
                    var rows = $("#authDealerTable").jqGrid('getRowData');
                    rows.forEach(function (itRow, id) {
                        if ($.inArray(itRow['dealerCode'], dealerCodeGroup) !== -1) {
                            dealerCodeGroupObj[itRow.dealerCode] = itRow.dealerName;// 由于点编辑按钮时没有给obj对照赋值，所以text缺失，在此处赋值
                            $("#authDealerTable").jqGrid('setSelection', id + 1, true);
                        }
                    });
                }
                setTimeout(function () {// 避开渲染完成勾选触发时间
                    dealerTableLoading = false;
                },250);
            },
            // rowattr: function (item) {
            //     if ($('#authInfo-modal').attr('editFlag')!=='true') {
            //         return {"class": "ui-state-disabled ui-jqgrid-disablePointerEvents"};
            //     }
            // },
            // beforeSelectRow: function (rowid, e) {
            //     if ($(e.target).closest("tr.jqgrow").hasClass("ui-state-disabled")) {
            //         return false;   // not allow select the row
            //     }
            //     return true;    // allow select the row
            // }
        };
        $("#authDealerTable").drawTable(obj);
    }
}

// 清空经销商表格查询条件
function resetAuthDealerSearch() {
    $("#nc_dealerName").val('');
    $('#nc_province').val('');
    $('#nc_province').trigger("chosen:updated");
    $('#nc_city').val('');
    $('#nc_city').trigger("chosen:updated");
    $('#nc_status').val('-1');
    $('#nc_status').trigger("chosen:updated");
}

// 查询条件展开收起
function slidSearch(that) {
    $('#authDealer_search').slideToggle();
    $(that).text() === '展开查询' ? $(that).text('收起查询') : $(that).text('展开查询');
}

// 经销商勾选变化
function dealerResChange(rowData, status) {
    if (rowData.dealerCode === '' || rowData.dealerCode === null || rowData.dealerCode === undefined) {
        layer.msg('经销商信息异常，操作失败');
        return;
    }
    if (status) {// 勾选
        if ($.inArray(rowData.dealerCode, dealerCodeGroup) === -1) {// 如果新勾选，则保存,由于已勾选状态可能会被全选再触发勾选，所以做条件处理
            dealerCodeGroup.push(rowData.dealerCode);
            dealerCodeGroupObj[rowData.dealerCode] = rowData.dealerName;
        }
    } else {// 取消勾选
        if ($.inArray(rowData.dealerCode, dealerCodeGroup) !== -1) {// 如果勾选过,从结果集中取出
            var newIndex = -1;
            dealerCodeGroup.forEach(function (it, indexN) {
                if (it === rowData.dealerCode) {
                    newIndex = indexN;
                }
            });
            dealerCodeGroup.splice(newIndex, 1);
            delete dealerCodeGroupObj[rowData.dealerCode];
        }
    }
    if(dealerCodeGroup.length===0){
        dealerAll = 0;// 全不选
    }else {
        dealerAll = 2;// 选择部分
    }

    // 判断经销商全选
    var totalNum = rowData.total;
    if (dealerCodeGroup.length === totalNum) {
        dealerAll = 1;
        dealerCodeGroup = [];
    }// 由于不加载的页面code不会进入dealerCodeGroup，当全选之后进行翻页会被else中的数量重新把dealerAll = 0，所以不再使用else

    updateInfoText('chooseAllDealerBtn');
}


// 选择全部经销商
function chooseAllDealer(that) {
    if ($(that).attr('flag') == 'chooseAll') {
        dealerAll = 1;
        $(that).attr('flag', 'chooseNothing');
        $(that).text('全部不选择');
        $('#authDealerBox').slideUp();
        updateInfoText('chooseAllDealerBtn');
    } else {
        dealerAll = 0;
        dealerCodeGroup = [];
        $(that).attr('flag', 'chooseAll');
        $(that).text('全部选择');
        $('#authDealerBox').slideDown();
        updateInfoText('chooseAllDealerBtn');
        loadDealerCheckTable();
    }
}

// checkBox全选-共通
function chooseAll(that) {
    var checkBoxGroup = $(that).attr('boxName');
    if ($(that).attr('flag') == 'chooseAll') {
        $("#" + checkBoxGroup + " input[name='child']").prop('checked', true);
        $("#" + checkBoxGroup + " input[name='parent']").prop('checked', true);
        $(that).attr('flag', 'chooseNothing');
        $(that).text('全部不选择');
    } else {
        $("#" + checkBoxGroup + "  input[name='child']").prop('checked', false);
        $("#" + checkBoxGroup + "  input[name='parent']").prop('checked', false);
        $(that).attr('flag', 'chooseAll');
        $(that).text('全部选择');
    }
    updateInfoText(checkBoxGroup);
}


// 初始化权限产品、省市信息
function loadAllProductAndRegionInfo() {
    layer.load(1);
    var successRequire;
    var commonCall = {};
    commonCall.success = function (fn) {
        successRequire = fn;
    };
    $.tAjax('/api/auth/getMasterData', {}).success(function (res) {
        layer.closeAll('loading');
        if (res.success) {
            var provinceData = res['region']['provinceList'];
            var cityData = res['region']['cityList'];
            drawCheckBoxGroup(provinceData, cityData, 'region', false);
            var productGroupData = res['product']['productGroupList'];
            var productData = res['product']['productList'];
            drawCheckBoxGroup(productGroupData, productData, 'product', true);
            if (successRequire) {
                successRequire();
            }
        } else {
            layer.msg(res.msg);
        }
    });
    return commonCall;
}

// 构建共通渲染数据结构
// 原始数据，产品/省市
var b_itemCode = 'itemCode';
var b_itemName = 'itemName';

function buildCheckBoxData(orgData, typeName) {
    // 统一转换key
    var itemCode = b_itemCode;
    var itemName = b_itemName;
    // 统一字段fun
    var buildItem = function (_data, codeStr, nameStr, recodeFlag) {
        _data.forEach(function (item, index) {
            if (recodeFlag) {
                item[itemCode] = nameStr + index;
            } else {
                item[itemCode] = item[codeStr];
            }
            item[itemName] = item[nameStr];
        });
        return _data;
    };

    // 统一补充字段
    var _parentData = orgData[0];
    var _childData = orgData[1];
    var parentData;
    var childData;
    if (typeName === 'region') {
        parentData = buildItem(_parentData, 'regionCode', 'regionName', false);
        childData = buildItem(_childData, 'regionCode', 'regionName', false);
    } else if (typeName === 'product') {
        parentData = buildItem(_parentData, null, 'productGroupName', true);// 产品组没有编码，用'productGroupName'+索引做临时编码
        childData = buildItem(_childData, 'productCode', 'productName', false);
    }

    return {
        parentData: parentData,
        childData: childData
    };
}

// 渲染checkBox
// recodeFlag：parentData是否重新编码
function drawCheckBoxGroup(_parentData, _childData, typeName, recodeFlag) {
    // 增加共通字段
    var dataObj = buildCheckBoxData([_parentData, _childData], typeName);
    var parentData = dataObj['parentData'];
    var childData = dataObj['childData'];
    // 渲染
    var parentMapping = {};// 给被重新编码过的code做映射用，如产品组现在编码是汉字，已在之前处理中补充了自定义编码，此时与childData中的parentCode映射不上
    var parentHtml = '';
    parentData.forEach(function (parent, index) {
        var str = '<div class="checkBoxGroup" id="parent' + parent[b_itemCode] + '">' +
            '<div class="parentName">' +
            '<label><input name="parent" onchange="chooseAllChange(this)" type="checkbox" class="ace" value="' + parent[b_itemCode] + '" /><span class="lbl"></span></label>' +
            parent[b_itemName] + '</div></div>';
        parentHtml += str;
        if (recodeFlag) {
            parentMapping[parent[b_itemName]] = parent[b_itemCode];// 生成映射
        }
    });

    $('#checkBoxGroup_' + typeName).html(parentHtml);
    var childObj = {};
    childData.forEach(function (cl, cindex) {
        var childO = {
            name: cl[b_itemName],
            code: cl[b_itemCode]
        };
        var parentKey = recodeFlag ? parentMapping[cl['parentCode']] : cl['parentCode'];
        if (childObj[parentKey] == undefined) {
            childObj[parentKey] = [childO];
        } else {
            childObj[parentKey].push(childO);
        }
    });
    for (var child in childObj) {
        var childHtml = '';
        childObj[child].forEach(function (it) {
            childHtml += '<label><input name="child" type="checkbox" class="ace" value="' + it.code + '" parCode="p' + child + '" onchange="childCheckChange(this)"/><span class="lbl">'
                + it.name + '</span></label>';
        });
        $('#parent' + child).append(childHtml);
    }
}

// 单组parent全选变动事件
function chooseAllChange(that) {
    var checkBoxGroup = $(that).closest('.checkBoxGroup').attr('id');
    if (!$(that).hasClass('isDrawing')) {// isDrawing防止在编辑勾选赋值的时候触发事件
        var parentCode = $(that).val();
        var val = $(that).prop("checked");
        if (val) {
            $("#" + checkBoxGroup + " input[name='child'][parCode=p" + parentCode + "]").prop('checked', true);
        } else {
            $("#" + checkBoxGroup + " input[name='child'][parCode=p" + parentCode + "]").prop('checked', false);
        }
        updateInfoText(checkBoxGroup);
    }
}


// child勾选状态变化，判断省全选
function childCheckChange(that) {
    var checkBoxGroup = $(that).closest('.checkBoxGroup').attr('id');
    var parentCode = $(that).attr('parCode').replace('p', '');
    var val = $(that).prop("checked");
    if (val) {
        if ($("#" + checkBoxGroup + " input[name='child'][parCode=p" + parentCode + "]:checked").length === $("#" + checkBoxGroup + " input[name='child'][parCode=p" + parentCode + "]").length) {
            $("#" + checkBoxGroup + " input[name='parent'][value=" + parentCode + "]").prop('checked', true);
        }
    } else {
        $("#" + checkBoxGroup + " input[name='parent'][value=" + parentCode + "]").prop('checked', false);
    }
    updateInfoText(checkBoxGroup);
}

// 更新已选择信息
function updateInfoText(selector) {
    var updateBox = $('#' + selector).attr('updateBox');
    if ($('#' + selector).hasClass('checkBoxGroup')) {
        updateBox = $('#' + selector).closest('.checkGroup').attr('updateBox');
        selector = $('#' + selector).closest('.checkGroup').attr('id');
    }

    if (selector.split('checkBoxGroup').length > 1) {// checkBoxGroup
        // 1.全选--全国/全产品/全部经销商
        if ($("#" + selector + " input[name='child']:checked").length === $("#" + selector + " input[name='child']").length) {
            var allText = $('#' + updateBox).attr('all');
            $('#' + updateBox).val(allText);
        }
        // 2.全不选-空
        else if ($("#" + selector + " input[name='child']:checked").length === 0) {
            $('#' + updateBox).val('');
        }
        // 3.只有一个，单字段
        else if ($("#" + selector + " input[name='child']:checked").length === 1) {
            var text = $("#" + selector + " input[name='child']:checked").eq(0).siblings('span.lbl').text();
            $('#' + updateBox).val(text);
        }
        // 4.多个，单字段+'等'
        else if ($("#" + selector + " input[name='child']:checked").length > 1) {
            var text = $("#" + selector + " input[name='child']:checked").eq(0).siblings('span.lbl').text() + '等';
            $('#' + updateBox).val(text);
        }
    } else {// table
        // 1.全选--全国/全产品/全部经销商
        if (dealerAll === 1) {
            $('#' + updateBox).val('全部经销商');
        }
        // 2.全不选-空
        else if (dealerCodeGroup.length === 0) {
            $('#' + updateBox).val('');
        } else if (dealerCodeGroup.length === 1) {
            $('#' + updateBox).val(dealerCodeGroupObj[dealerCodeGroup[0]]);
        } else if (dealerCodeGroup.length > 1) {
            if(dealerCodeGroupObj[dealerCodeGroup[0]]){
                $('#' + updateBox).val(dealerCodeGroupObj[dealerCodeGroup[0]] + '等');
            }else {// 当前页不再有勾选的内容，同时无法获取勾选经销商text时（比如没有翻到过有勾选的那一页）,此时放下检索条件，自动查询已勾选，给text赋值
                if(!dealerTableLoading){// 且dealerTable加载完成，不然可能出现无限刷新
                    $('#authDealer_search').slideDown();
                    $('#nc_status').val('1');
                    $('#nc_status').trigger("chosen:updated");
                    loadDealerCheckTable()
                }
            }
        }
    }
}

// auth详情 modal关闭提醒
function closeTips() {
    layer.confirm('是否放弃所有已编辑数据并离开操作页面？', {
        btn: ['是', '否'] //按钮
    }, function (index) { // btn 是
        layer.close(index);
        $("#authInfo-modal").modal('hide');
    }, function (index) { // btn 否
        layer.close(index);
    });
}
