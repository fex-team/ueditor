##ueditor 百度编辑器


###优化：
* 修改服务端配置文件名称为ueditor.config
* 修改了ConfigManager：服务端配置文件从classes目录读取，如果不存在则从webapp的ueditor目录读取配置，增强ueditor的安全性，防止配置文件被窥探；
* 修改BinaryUploader、Base64Uploader:允许配置存储路径，支持存储路径配置为绝对路径形式。
	具体做法：controller.jsp中，在request作用域内指定变量rootPath和对应的存储跟路径 ,ueditor会优先查找该配置，如果没有则将网站根目录作为rootPath(即原有配置)。