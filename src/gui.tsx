

module QalcGui {
	interface GuiLineElement {
		input: string
		output: string
	}
	interface GuiState {
		lines: GuiLineElement[];
		ready: boolean;
	}
	export class GUILine extends React.Component<{ line: GuiLineElement }, {}> {
		render() {
			return <div className="gui-line"><hr />
					<p>> {this.props.line.input}</p>
					<pre><code>{this.props.line.output}</code></pre>
				</div>
		}
	}
	let guiInst: GUI;
	export class GUI extends React.Component<{}, GuiState> {
		constructor(props) {
			super(props);
			guiInst = this;
			this.state = {ready:false, "lines":[{"input":"88 mph to km/s","output":"  88 * mph = 0.03933952(km / s)\n"},{"input":"sqrt(2 * (6 million tons * 500000 MJ/kg) / (100000 pounds))/c","output":"  sqrt((2 * ((6 * million * tonne * 500000 * megajoule) / kilogram)) / (100000 * pound)) / speed_of_light = approx. 1.2131711\n"},{"input":"testing","output":"  tonne * e * second * tonne * inch * gram = approx. 2718.2818 kg^3 * in*s\n"}]}
		}
		onReady() {
			this.state.ready = true;
			this.setState(this.state);
		}
		addLine(line: GuiLineElement) {
			const lines = this.state.lines.slice();
			lines.unshift(line);
			this.setState({ lines: lines, ready: true });
		}
		keyPress(evt: KeyboardEvent) {
			if (evt.charCode == 13) {// enter
				const target = evt.target as HTMLInputElement;
				const input = target.value.trim();
				if(input.length > 0) QalcLib.qalculate(input, output => 
					this.addLine({ input: input, output: output })
				);
				target.value = "";
			}
		}
		render() {
			return <div>
				> <input disabled={!this.state.ready} onKeyPress={this.keyPress.bind(this) } size={100} />
				{this.state.lines.map(line => <GUILine line={line} />) }
				</div>;
		}
	}
	QalcLib.init(() => guiInst.onReady());
}
React.render(
<div className="container">
	<div className="page-header">
		<h1>Qalc <small id="loadingWait">Loading</small></h1>
	</div>
	<QalcGui.GUI />
</div>, document.body);