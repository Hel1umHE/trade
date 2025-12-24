// 修改个人信息组件
const EditProfileComponent = {
    template: `
        <div>
            <h4>修改个人信息</h4>
            <div class="mt-4">
                <div class="card">
                    <div class="card-body">
                        <form @submit.prevent="updateProfile">
                            <div class="mb-3">
                                <label for="nickname" class="form-label">昵称</label>
                                <input type="text" class="form-control" id="nickname" v-model="userForm.nickname" autocomplete="off" required maxlength="20">
                            </div>
                            <div class="mb-3">
                                <label for="realName" class="form-label">真实姓名</label>
                                <input type="text" class="form-control shadow-none" id="realName" v-model="userForm.realName" readonly>
                            </div>
                            <div class="mb-3">
                                <label for="className" class="form-label">班级</label>
                                <input type="text" class="form-control shadow-none" id="className" v-model="userForm.className" readonly>
                            </div>
                            <div class="mb-3">
                                <label for="studentID" class="form-label">学号</label>
                                <input type="text" class="form-control shadow-none" id="studentID" v-model="userForm.studentID" readonly>
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
            userForm: {
                nickname: '', // 昵称
                realName: '', // 真实姓名
                className: '', // 班级
                studentID: '' // 学号
            }
        };
    },
    mounted() {
        // 加载当前用户信息到表单
        this.loadUserInfo();
    },
    methods: {
        loadUserInfo() {
            // 获取当前用户信息
            const storedUser = localStorage.getItem('userInfo');
            if (storedUser) {
                const userInfo = JSON.parse(storedUser);
                // 将用户信息填充到表单
                this.userForm.nickname = userInfo.nickname || '';
                this.userForm.realName = userInfo.realName || '';
                this.userForm.className = userInfo.className || '';
                this.userForm.studentID = userInfo.studentID || '';
            }
        },
        updateProfile() {
            // 表单验证
            if (!this.userForm.nickname.trim()) {
                alert('昵称不能为空');
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

            // 获取所有用户列表
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // 找到当前用户
            const currentUserIndex = users.findIndex(user => user.id === currentUserId);
            if (currentUserIndex === -1) {
                alert('用户不存在');
                return;
            }

            // 更新用户信息（仅更新昵称，其他字段保持不变）
            const updatedUser = {
                ...users[currentUserIndex],
                nickname: this.userForm.nickname
            };

            // 更新用户列表
            users[currentUserIndex] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));

            // 更新当前登录用户信息
            const updatedUserInfo = {
                ...userInfo,
                nickname: this.userForm.nickname
            };
            localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));

            // 同时更新父组件的userInfo数据，避免需要手动刷新页面
            this.$parent.userInfo = updatedUserInfo;

            // 提示修改成功
            alert('个人信息修改成功');

            // 返回个人中心
            this.goBack();
        },
        goBack() {
            // 返回上一页
            this.$router.back();
        }
    }
};