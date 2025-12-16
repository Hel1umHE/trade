// 私聊组件
const ChatComponent = {
    template: `
        <div>
            <h4>私聊</h4>
            <div class="chat-container mt-4">
                <!-- 消息列表 -->
                <div class="chat-list">
                    <h6>消息列表</h6>
                    <div class="list-group mt-3">
                        <a href="#" class="list-group-item list-group-item-action active">
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1">用户1</h6>
                                <small>10:30</small>
                            </div>
                            <p class="mb-1">你好，这个商品还在吗？</p>
                        </a>
                        <a href="#" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1">用户2</h6>
                                <small>昨天</small>
                            </div>
                            <p class="mb-1">谢谢，商品已经收到了！</p>
                        </a>
                        <a href="#" class="list-group-item list-group-item-action">
                            <div class="d-flex w-100 justify-content-between">
                                <h6 class="mb-1">用户3</h6>
                                <small>2天前</small>
                            </div>
                            <p class="mb-1">请问可以便宜一点吗？</p>
                        </a>
                    </div>
                </div>
                <!-- 聊天界面 -->
                <div class="chat-main">
                    <div class="chat-header">
                        <h6>与 用户1 聊天</h6>
                    </div>
                    <div class="chat-messages">
                        <div class="mb-3">
                            <div class="d-flex justify-content-start mb-2">
                                <span class="badge bg-primary me-2">用户1</span>
                                <small class="text-muted">10:30</small>
                            </div>
                            <div class="bg-light p-2 rounded" style="display: inline-block;">
                                你好，这个商品还在吗？
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex justify-content-end mb-2">
                                <small class="text-muted me-2">10:31</small>
                                <span class="badge bg-secondary">我</span>
                            </div>
                            <div class="bg-primary text-white p-2 rounded" style="display: inline-block; float: right;">
                                还在的，请问您有什么需要了解的吗？
                            </div>
                        </div>
                        <div class="mb-3">
                            <div class="d-flex justify-content-start mb-2">
                                <span class="badge bg-primary me-2">用户1</span>
                                <small class="text-muted">10:32</small>
                            </div>
                            <div class="bg-light p-2 rounded" style="display: inline-block;">
                                请问可以便宜一点吗？
                            </div>
                        </div>
                    </div>
                    <div class="chat-input">
                        <input type="text" class="form-control" placeholder="输入消息...">
                        <button class="btn btn-primary">发送</button>
                    </div>
                </div>
            </div>
        </div>
    `
};