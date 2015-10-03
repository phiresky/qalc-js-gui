module QalcLib {
	export function qalculate(input: string): string {
		// todo: insert actual qalc lib
		try { return eval(input) }
		catch (e) {
			return `invalid input '${input}: ${e}'`;
		}
	}
}

module QalcGui {
	interface GuiLineElement {
		input: string
		output: string
	}
	interface GuiState {
		lines: GuiLineElement[];
	}
	export class GUILine extends React.Component<{ line: GuiLineElement }, {}> {
		render() {
			return <div>
					<p>> {this.props.line.input}</p>
					<p><code>{this.props.line.output}</code></p>
				</div>
		}
	}
	export class GUI extends React.Component<{}, GuiState> {
		constructor(props) {
			super(props);
			this.state = { lines: [] };
		}

		addLine(line: GuiLineElement) {
			const lines = this.state.lines.slice();
			lines.push(line);
			this.setState({ lines: lines });
		}
		keyPress(evt: KeyboardEvent) {
			if (evt.charCode == 13) {// enter
				const target = evt.target as HTMLInputElement;
				this.addLine({ input: target.value, output: QalcLib.qalculate(target.value) });
				target.value = "";
			}
		}
		render() {
			return <div>
				{this.state.lines.map(line => <GUILine line={line} />) }
				> <input onKeyPress={this.keyPress.bind(this) }/>
				</div>;
		}
	}
}

React.render(
<div className="container">
	<div className="page-header">
		<h1>Qalc</h1>
	</div>
	<QalcGui.GUI />
</div>, document.body);