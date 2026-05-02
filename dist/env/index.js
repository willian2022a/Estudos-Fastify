"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/env/index.ts
var env_exports = {};
__export(env_exports, {
  env: () => env
});
module.exports = __toCommonJS(env_exports);
var import_dotenv = require("dotenv");
var import_zod = __toESM(require("zod"));
console.log(">>>>>>>>>>>>>>>>>>>>", process.env.NODE_ENV);
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test" });
  console.log(">>>>>>>>>>>>>>>>>>>> 111", process.env.NODE_ENV);
} else {
  console.log(">>>>>>>>>>>>>>>>>>>> 222", process.env.NODE_ENV);
  (0, import_dotenv.config)();
}
var envSquema = import_zod.default.object({
  NODE_ENV: import_zod.default.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: import_zod.default.string(),
  PORT: import_zod.default.number().default(3333)
});
var _env = envSquema.safeParse(process.env);
if (_env.success === false) {
  console.error("Invalid enviroment variables! ", import_zod.default.treeifyError(_env.error));
  throw new Error("Invalid enviroment variables");
}
var env = _env.data;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  env
});
