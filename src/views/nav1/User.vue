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
						<el-input v-model="filters.vusername" placeholder="登录账户"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="getUsers">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleAdd">新增</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!--列表-->
			<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column type="index" width="60">
				</el-table-column>
				<el-table-column prop="loginName" label="登录账号" width="120" sortable></el-table-column>
				<el-table-column prop="vusername" label="姓名" width="100" sortable></el-table-column>
				<el-table-column prop="mobile" label="手机号" width="100" sortable></el-table-column>
				<el-table-column prop="email" label="电子邮箱" width="120" sortable></el-table-column>
				<el-table-column prop="genTime" label="创建时间" min-width="180" sortable></el-table-column>
				<el-table-column prop="lastLoginTime" label="最后一次登录时间" min-width="180" sortable></el-table-column>
				<el-table-column prop="lock" label="是否锁定" min-width="180" :formatter="formatSex" sortable></el-table-column>
				<el-table-column label="操作" width="150">
					<template scope="scope">
						<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!--工具条-->
			<el-col :span="24" class="toolbar">
				<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
				<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
				</el-pagination>
			</el-col>

			<!--编辑界面-->
			<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
				<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
					<el-form-item label="登录账号" prop="loginName">
						<el-input placeholder="输入登录账号" v-model="editForm.loginName" auto-complete="off"/>
					</el-form-item>
					<el-form-item label="真实姓名" prop="vusername">
						<el-input placeholder="输入真实姓名" v-model="editForm.vusername" auto-complete="off"/>
					</el-form-item>
					<el-form-item label="手机号">
						<el-input placeholder="输入手机号" v-model="editForm.mobile"/>
					</el-form-item>
					<el-form-item label="电子邮箱">
						<el-input placeholder="输入电子邮箱" v-model="editForm.email"/>
					</el-form-item>
					<el-form-item label="是否锁定">
						<el-radio-group v-model="editForm.lock">
							<el-radio class="radio" :label="1">是</el-radio>
							<el-radio class="radio" :label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="editFormVisible = false">取消</el-button>
					<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
				</div>
			</el-dialog>

			<!--新增界面-->
			<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
				<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
					<el-form-item label="登录账号" prop="loginName">
						<el-input placeholder="输入登录账号" v-model="addForm.loginName" auto-complete="off"/>
					</el-form-item>
					<el-form-item label="密码" prop="loginName">
						<el-input type="password" placeholder="输入登录密码" v-model="addForm.password" show-password auto-complete="off"/>
					</el-form-item>
					<el-form-item label="确认密码" prop="loginName">
						<el-input type="password" placeholder="输入登录密码" v-model="addForm.checkPass" show-password auto-complete="off"/>
					</el-form-item>
					<el-form-item label="真实姓名" prop="vusername">
						<el-input placeholder="输入真实姓名" v-model="addForm.vusername" auto-complete="off"/>
					</el-form-item>
					<el-form-item label="手机号">
						<el-input placeholder="输入手机号" v-model="addForm.mobile"/>
					</el-form-item>
					<el-form-item label="电子邮箱">
						<el-input placeholder="输入电子邮箱" v-model="addForm.email"/>
					</el-form-item>
					<el-form-item label="是否锁定">
						<el-radio-group v-model="addForm.lock">
							<el-radio class="radio" :label="1">是</el-radio>
							<el-radio class="radio" :label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click.native="addFormVisible = false">取消</el-button>
					<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
				</div>
			</el-dialog>
		</el-col>
	</el-row>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
                    vusername: ''
				},
				users: [],
				total: 0,
				page: 1,
				pageSize: 3,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {

				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					lock: 0
				}

			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.lock == 1 ? '是' : row.lock == 0 ? '否' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				this.listLoading = true;
				let para = {vusername: this.filters.vusername, currentPage: this.page, pageSize: this.pageSize};
				getUserListPage(para).then((res) => {
					this.total = res.data.data.totalNum;
					this.users = res.data.data.data;
					this.listLoading = false;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = { userId: row.userId };
                    removeUser(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					loginName: 'zhangsan',
					vusername: '张三',
					password: '111111',
					checkPass: '111111',
					mobile: '17711111111',
					email: '17711111111@qq.com',
					lock: 0
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
                            addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>