# ai-collab-template CLI

AI 编程工具配置模板命令行工具。

## 安装

```bash
npm install -g ai-collab-template
```

或使用 npx 直接运行：

```bash
npx ai-collab-template <command>
```

## 命令

### list

列出所有可用模板：

```bash
ai-collab-template list
```

### init

初始化模板到当前目录：

```bash
# 交互式选择
ai-collab-template init

# 指定模板
ai-collab-template init --template frontend-react

# 跳过确认
ai-collab-template init --template frontend-react --yes
```

## 本地开发

```bash
cd cli
npm install
npm link

# 测试
ai-collab-template list
```
