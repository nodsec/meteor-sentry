declare module SentryLogger {
    export function init(options:Record<string,any>):void;
    export function initBrowser(options:Record<string,any>):void;
    export function initReact(options:Record<string,any>):void;
    export function fatal(event:string|Error, extra:Record<string,any>):void;
    export function error(event:string|Error, extra:Record<string,any>):void;
    export function warning(event:string|Error, extra:Record<string,any>):void;
    export function log(event:string|Error, extra:Record<string,any>):void;
    export function info(event:string|Error, extra:Record<string,any>):void;
    export function debug(event:string|Error, extra:Record<string,any>):void;
    export function critical(event:string|Error, extra:Record<string,any>):void;
}