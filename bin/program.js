var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QalcLib;
(function (QalcLib) {
    function qalculate(input) {
        // todo: insert actual qalc lib
        try {
            return eval(input);
        }
        catch (e) {
            return "invalid input '" + input + ": " + e + "'";
        }
    }
    QalcLib.qalculate = qalculate;
})(QalcLib || (QalcLib = {}));
var QalcGui;
(function (QalcGui) {
    var GUILine = (function (_super) {
        __extends(GUILine, _super);
        function GUILine() {
            _super.apply(this, arguments);
        }
        GUILine.prototype.render = function () {
            return React.createElement("div", null, React.createElement("p", null, "> ", this.props.line.input), React.createElement("p", null, React.createElement("code", null, this.props.line.output)));
        };
        return GUILine;
    })(React.Component);
    QalcGui.GUILine = GUILine;
    var GUI = (function (_super) {
        __extends(GUI, _super);
        function GUI(props) {
            _super.call(this, props);
            this.state = { lines: [] };
        }
        GUI.prototype.addLine = function (line) {
            var lines = this.state.lines.slice();
            lines.push(line);
            this.setState({ lines: lines });
        };
        GUI.prototype.keyPress = function (evt) {
            if (evt.charCode == 13) {
                var target = evt.target;
                this.addLine({ input: target.value, output: QalcLib.qalculate(target.value) });
                target.value = "";
            }
        };
        GUI.prototype.render = function () {
            return React.createElement("div", null, this.state.lines.map(function (line) { return React.createElement(GUILine, {"line": line}); }), "> ", React.createElement("input", {"onKeyPress": this.keyPress.bind(this)}));
        };
        return GUI;
    })(React.Component);
    QalcGui.GUI = GUI;
})(QalcGui || (QalcGui = {}));
document.addEventListener('DOMContentLoaded', function () {
    React.render(React.createElement(QalcGui.GUI, null), document.getElementById("gui"));
});
