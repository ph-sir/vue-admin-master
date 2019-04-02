<template>
	<el-row :gutter="20">

		<el-col :span="6">
			<el-tree :data="data" :props="defaultProps" default-expand-all="true" @node-click="handleNodeClick"></el-tree>
		</el-col>
		<el-col :span="18">
			<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="filters">
					<el-form-item>
						<el-input v-model="filters.orgName" placeholder="组织名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="getOrgs">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleAdd">新增</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="orgs" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="orgName" label="组织名称" sortable/>
				<el-table-column prop="porgName" label="父组织名称" sortable/>
				<el-table-column prop="description" label="组织描述"/>
				<el-table-column prop="genTime" label="创建时间" sortable/>
				<el-table-column label="操作" width="150">
					<template scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-col>



	</el-row>
</template>

<script>
    import { getOrgList, removeOrg, editOrg, addOrg } from '../../api/api';

	export default {
		data() {
			return {
                filters: {
                    orgName: ''
                },
				orgs: [],
                sels: [],//列表选中列
                data: [{
                    label: '一级 1',
                    children: [{
                        label: '二级 1-1',
                        children: [{
                            label: '三级 1-1-1'
                        }]
                    }]
                }, {
                    label: '一级 2',
                    children: [{
                        label: '二级 2-1',
                        children: [{
                            label: '三级 2-1-1'
                        }]
                    }, {
                        label: '二级 2-2',
                        children: [{
                            label: '三级 2-2-1'
                        }]
                    }]
                }, {
                    label: '一级 3',
                    children: [{
                        label: '二级 3-1',
                        children: [{
                            label: '三级 3-1-1'
                        }]
                    }, {
                        label: '二级 3-2',
                        children: [{
                            label: '三级 3-2-1'
                        }]
                    }]
                }]
			}
		},
		methods: {
            getOrgs() {
                this.listLoading = true;
                let para = {orgName: this.filters.orgName};
                getOrgList(para).then((res) => {
                    this.orgs = res.data.data;
                    this.listLoading = false;
                });
			}
		},
        mounted() {
            this.getOrgs();
        }
	}

</script>