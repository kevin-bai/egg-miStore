class AppBootHook {
    constructor(app) {
        this.app = app
    }

    configWillLoad() {
        console.log('configWillLoad')
        //console.log(this.app.config)
    }

    async didLoad() {
        console.log('didLoad')
        // 所有的配置已经加载完毕
        // 可以用来加载应用自定义的文件，启动自定义的服务
    
        // 例如：创建自定义应用的示例
        // this.app.queue = new Queue(this.app.config.queue);
        // await this.app.queue.init();
    
        // 例如：加载自定义的目录
        // app.loader.loadToContext(path.join(__dirname, 'app/tasks'), 'tasks', {
        //   fieldClass: 'tasksClasses',
        // });
      }
}
module.exports = AppBootHook;