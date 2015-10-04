var QalcLib;
(function (QalcLib) {
    QalcLib.cache = "> ";
    var lastCallback;
    function init(readyCallback) {
        QalcLib.emulator = new V86Starter({
            memory_size: 50 * 1024 * 1024,
            vga_memory_size: 2 * 1024 * 1024,
            bios: { url: "lib/sea" },
            vga_bios: { url: "lib/vga" },
            cdrom: { url: "lib/cd.js" },
            initial_state: { url: "http://cdn.rawgit.com/phiresky/qalc-js-gui/gh-pages/lib/state.js" },
            autostart: true,
            disable_keyboard: true,
            disable_mouse: true
        });
        QalcLib.emulator.add_listener("download-progress", function (e) {
            $("#loadingWait").text("Loading: " + (e.loaded / 1e7).toFixed(2) + "/" + (e.total / 1e6).toFixed(2) + " MByte");
        });
        QalcLib.emulator.add_listener("emulator-ready", function (e) {
            $("#loadingWait").text("");
            readyCallback();
        });
        QalcLib.emulator.add_listener("serial0-output-char", function (char) {
            if (char === "\r")
                return;
            QalcLib.cache += char;
            if (char === ">" && QalcLib.cache.split("\n").pop().trim().length === 1) {
                lastCallback(QalcLib.cache);
                QalcLib.cache = "";
            }
        });
    }
    QalcLib.init = init;
    function qalculate(input, callback) {
        if (input.trim().toLowerCase() == "quit") {
            history.back();
            document.body.textContent = "";
        }
        var ignore = true;
        QalcLib.emulator.run();
        lastCallback = function (output) {
            callback(output.substring(input.length + 3, output.length - 2));
            QalcLib.emulator.stop();
        };
        QalcLib.emulator.serial0_send(input + "\n");
    }
    QalcLib.qalculate = qalculate;
})(QalcLib || (QalcLib = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QalcGui;
(function (QalcGui) {
    var GUILine = (function (_super) {
        __extends(GUILine, _super);
        function GUILine() {
            _super.apply(this, arguments);
        }
        GUILine.prototype.render = function () {
            return React.createElement("div", {"className": "gui-line"}, React.createElement("hr", null), React.createElement("p", null, "> ", this.props.line.input), React.createElement("p", null, React.createElement("code", null, this.props.line.output)));
        };
        return GUILine;
    })(React.Component);
    QalcGui.GUILine = GUILine;
    var guiInst;
    var GUI = (function (_super) {
        __extends(GUI, _super);
        function GUI(props) {
            _super.call(this, props);
            guiInst = this;
            this.state = { ready: false, "lines": [{ "input": "88 mph to km/s", "output": "  88 * mph = 0.03933952(km / s)\n" }, { "input": "sqrt(2 * (6 million tons * 500000 MJ/kg) / (100000 pounds))/c", "output": "  sqrt((2 * ((6 * million * tonne * 500000 * megajoule) / kilogram)) / (100000 * pound)) / speed_of_light = approx. 1.2131711\n" }, { "input": "testing", "output": "\n  tonne * e * second * tonne * inch * gram = approx. 2718.2818 kg^3 * in*s\n" }] };
        }
        GUI.prototype.onReady = function () {
            this.state.ready = true;
            this.setState(this.state);
        };
        GUI.prototype.addLine = function (line) {
            var lines = this.state.lines.slice();
            lines.unshift(line);
            this.setState({ lines: lines, ready: true });
        };
        GUI.prototype.keyPress = function (evt) {
            var _this = this;
            if (evt.charCode == 13) {
                var target = evt.target;
                var input = target.value.trim();
                if (input.length > 0)
                    QalcLib.qalculate(input, function (output) {
                        return _this.addLine({ input: input, output: output });
                    });
                target.value = "";
            }
        };
        GUI.prototype.render = function () {
            return React.createElement("div", null, "> ", React.createElement("input", {"disabled": !this.state.ready, "onKeyPress": this.keyPress.bind(this), "size": 100}), this.state.lines.map(function (line) { return React.createElement(GUILine, {"line": line}); }));
        };
        return GUI;
    })(React.Component);
    QalcGui.GUI = GUI;
    QalcLib.init(function () { return guiInst.onReady(); });
})(QalcGui || (QalcGui = {}));
React.render(React.createElement("div", {"className": "container"}, React.createElement("div", {"className": "page-header"}, React.createElement("h1", null, "Qalc ", React.createElement("small", {"id": "loadingWait"}, "Loading"))), React.createElement(QalcGui.GUI, null)), document.body);
