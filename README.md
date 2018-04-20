# eact-gallery

## 安装yeoman

```javascript
npm install yo
npm install -g generator-react-webpack
```

## 安装react-webpack

```javascript
yo react-webpack gallery-by-react
```

## 环境

> ES6 + React + webpack

## React创建组件方式的改变

```javascript
class ComponentName extends React.Component{
    render() {
        return ();
    }
}
```

## ref获取子组件内容的变化

```html
<div ref="nodeName"></div>
```
```javascript
let targetNode = ReactDOM.findDOMNode(this.refs.nodeName);
```