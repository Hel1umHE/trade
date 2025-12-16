// 修改密码组件
const ChangePasswordComponent = {
    template: `
        <div>
            <h4>修改密码</h4>
            <div class="mt-4">
                <div class="card">
                    <div class="card-body">
                        <form @submit.prevent="changePassword">
                            <div class="mb-3">
                                <label for="oldPassword" class="form-label">当前密码</label>
                                <input type="password" class="form-control" id="oldPassword" v-model="oldPassword" required>
                            </div>
                            <div class="mb-3">
                                <label for="newPassword" class="form-label">新密码</label>
                                <input type="password" class="form-control" id="newPassword" v-model="newPassword" required>
                            </div>
                            <div class="mb-3">
                                <label for="confirmPassword" class="form-label">确认新密码</label>
                                <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword" required>
                            </div>
                            <button type="submit" class="btn btn-primary">确认修改</button>
                            <button type="button" class="btn btn-secondary ms-2" @click="goBack">返回</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            oldPassword: '', // 当前密码
            newPassword: '', // 新密码
            confirmPassword: '' // 确认新密码
        };
    },
    methods: {
        changePassword() {
            // 验证密码格式
            if (this.newPassword.length < 6) {
                alert('新密码长度不能少于6位');
                return;
            }

            // 验证两次输入的新密码是否一致
            if (this.newPassword !== this.confirmPassword) {
                alert('两次输入的新密码不一致');
                return;
            }

            // 获取当前用户信息
            const storedUser = localStorage.getItem('userInfo');
            if (!storedUser) {
                alert('用户信息不存在');
                return;
            }

            const userInfo = JSON.parse(storedUser);
            const currentUserId = parseInt(userInfo.id);
            const currentUserPhone = userInfo.phone;

            // 获取所有用户列表
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // 找到当前用户
            const currentUser = users.find(user => user.id === currentUserId);
            if (!currentUser) {
                alert('用户不存在');
                return;
            }

            // 验证当前密码是否正确
            if (currentUser.password !== this.oldPassword) {
                alert('当前密码输入错误');
                return;
            }

            // 更新用户密码
            currentUser.password = this.newPassword;

            // 更新用户列表
            const updatedUsers = users.map(user =>
                user.id === currentUserId ? currentUser : user
            );
            localStorage.setItem('users', JSON.stringify(updatedUsers));

            // 提示修改成功
            alert('密码修改成功，请重新登录');

            // 清除当前用户信息，要求重新登录
            localStorage.removeItem('userInfo');
            localStorage.removeItem('currentUser');

            // 跳转到登录页面
            window.location.href = 'login.html';
        },
        goBack() {
            // 返回上一页
            this.$router.back();
        }
    }
};