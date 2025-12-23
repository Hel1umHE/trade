// 用户管理板块组件
const UsersComponent = {
    template: `
        <div>
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5>用户列表</h5>
                    <div class="input-group" style="width: 300px;">
                        <input type="text" class="form-control" placeholder="搜索用户..." v-model="searchKeyword" autocomplete="off">
                        <button class="btn btn-primary" @click="searchUsers">搜索</button>
                    </div>
                </div>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>昵称</th>
                            <th>手机号</th>
                            <th>身份认证</th>
                            <th>注册时间</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in filteredUsers" :key="user.id">
                            <td>{{ user.id }}</td>
                            <td>{{ user.nickname }}</td>
                            <td>{{ user.phone }}</td>
                            <td>
                                <span class="badge" :class="user.isVerified ? 'bg-success' : 'bg-danger'">
                                    {{ user.isVerified ? '已认证' : '未认证' }}
                                </span>
                            </td>
                            <td>{{ formatDate(user.createdAt) }}</td>
                            <td>
                                <button class="btn btn-sm btn-warning" @click="toggleVerification(user)">
                                    <i class="bi bi-shield"></i> {{ user.isVerified ? '取消认证' : '认证' }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- 分页 -->
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                            <button class="page-link" @click="currentPage--">上一页</button>
                        </li>
                        <li class="page-item" :class="{ active: currentPage === i }" v-for="i in totalPages" :key="i">
                            <button class="page-link" @click="currentPage = i">{{ i }}</button>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                            <button class="page-link" @click="currentPage++">下一页</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    `,
    data() {
        return {
            users: [],
            searchKeyword: '',
            currentPage: 1,
            pageSize: 10
        };
    },
    computed: {
        // 过滤后的用户列表
        filteredUsers() {
            let result = this.users;

            // 搜索过滤
            if (this.searchKeyword) {
                const keyword = this.searchKeyword.toLowerCase();
                result = result.filter(user =>
                    user.nickname.toLowerCase().includes(keyword) ||
                    user.phone.includes(keyword)
                );
            }

            // 分页
            const startIndex = (this.currentPage - 1) * this.pageSize;
            return result.slice(startIndex, startIndex + this.pageSize);
        },
        // 总页数
        totalPages() {
            return Math.ceil(this.users.length / this.pageSize);
        }
    },
    mounted() {
        // 加载用户数据
        this.loadUsers();
    },
    methods: {
        // 加载用户数据
        loadUsers() {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            this.users = users;
        },
        // 搜索用户
        searchUsers() {
            this.currentPage = 1;
        },
        // 编辑用户
        editUser(user) {
            // 这里可以实现编辑用户的逻辑，例如打开编辑模态框
            alert(`编辑用户: ${user.nickname}`);
        },
        // 切换用户认证状态
        toggleVerification(user) {
            if (confirm(`确定要${user.isVerified ? '取消认证' : '认证'}用户 ${user.nickname} 吗？`)) {
                // 从localStorage中更新用户认证状态
                let users = JSON.parse(localStorage.getItem('users')) || [];
                users = users.map(u => {
                    if (u.id === user.id) {
                        return { ...u, isVerified: !u.isVerified };
                    }
                    return u;
                });
                localStorage.setItem('users', JSON.stringify(users));
                // 重新加载用户列表
                this.loadUsers();
                alert('用户认证状态已更新');
            }
        },
        // 格式化日期
        formatDate(timestamp) {
            if (!timestamp) return '';
            const date = new Date(timestamp);
            return date.toLocaleString();
        }
    }
};