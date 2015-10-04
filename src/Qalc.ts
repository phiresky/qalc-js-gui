module QalcLib {
	declare var V86Starter: any;
	
	export let emulator;
	export let cache = "> ";
	let lastCallback: (output:string) => void;
	
	export function init(readyCallback) {
		emulator = new V86Starter({
			memory_size: 50 * 1024 * 1024,
			vga_memory_size: 2 * 1024 * 1024,
			bios: { url: "lib/sea"},
			vga_bios: { url: "lib/vga"},
			cdrom: { url: "lib/cd.js"},
			initial_state: { url: "http://cdn.rawgit.com/phiresky/qalc-js-gui/gh-pages/lib/state.js" },
			autostart: true,
			disable_keyboard: true,
			disable_mouse: true
		});
		emulator.add_listener("download-progress", function(e) {
			$("#loadingWait").text(`Loading: ${(e.loaded/1e7).toFixed(2)}/${(e.total/1e6).toFixed(2)} MByte`);
		});
		emulator.add_listener("emulator-ready", function(e) {
			$("#loadingWait").text("");
			readyCallback();
		});
		emulator.add_listener("serial0-output-char", function(char) {
			if(char === "\r") return;
			cache += char;
			if(char === ">" && cache.split("\n").pop().trim().length === 1) {
				lastCallback(cache);
				cache = "";
			}
		});
	}
	
	export function qalculate(input: string, callback:(output:string) => void) {
		if(input.trim().toLowerCase() == "quit") {
			history.back();
			document.body.textContent="";
		}
		let ignore = true;
		emulator.run();
		lastCallback = output => {
			callback(output.substring(input.length + 3, output.length - 2));
			emulator.stop();
		}
		emulator.serial0_send(input+"\n");
	}
}