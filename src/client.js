"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios_1 = require("axios");
var readline = require("readline");
// GET PORT FROM ENV
var PORT = process.env.PORT || 4000;
var baseUrl = "http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4000";
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Function to fetch all tasks
function getAllTasks() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1, axiosError;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1["default"].get("".concat(baseUrl, "/tasks"))];
                case 1:
                    response = _b.sent();
                    console.log('All tasks:', response.data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    axiosError = error_1;
                    console.error('Error fetching all tasks:', ((_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.data) || axiosError.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Function to create a new task
function createTask() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            rl.question('Enter task title: ', function (title) { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    rl.question('Enter task description: ', function (description) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            rl.question('Enter due date (YYYY-MM-DD): ', function (dueDate) { return __awaiter(_this, void 0, void 0, function () {
                                var taskData, response, error_2, axiosError;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            _b.trys.push([0, 2, 3, 4]);
                                            taskData = { title: title, description: description, dueDate: dueDate };
                                            return [4 /*yield*/, axios_1["default"].post("".concat(baseUrl, "/tasks"), taskData)];
                                        case 1:
                                            response = _b.sent();
                                            console.log('Created task:', response.data);
                                            return [3 /*break*/, 4];
                                        case 2:
                                            error_2 = _b.sent();
                                            axiosError = error_2;
                                            console.error('Error creating task:', ((_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.data) || axiosError.message);
                                            return [3 /*break*/, 4];
                                        case 3:
                                            rl.close();
                                            return [7 /*endfinally*/];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [2 /*return*/];
                        });
                    }); });
                    return [2 /*return*/];
                });
            }); });
            return [2 /*return*/];
        });
    });
}
// Function to search tasks by title
function searchTasksByTitle() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            rl.question('Enter task title to search: ', function (title) { return __awaiter(_this, void 0, void 0, function () {
                var response, error_3;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, 3, 4]);
                            return [4 /*yield*/, axios_1["default"].get("".concat(baseUrl, "/tasks/search/").concat(title))];
                        case 1:
                            response = _b.sent();
                            console.log("Tasks with title '".concat(title, "':"), response.data);
                            return [3 /*break*/, 4];
                        case 2:
                            error_3 = _b.sent();
                            console.error("Error searching tasks with title '".concat(title, "':"), ((_a = error_3.response) === null || _a === void 0 ? void 0 : _a.data) || error_3.message);
                            return [3 /*break*/, 4];
                        case 3:
                            rl.close();
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
// Interactive menu
function startMenu() {
    console.log('Choose an option:');
    console.log('1. Fetch all tasks');
    console.log('2. Create a new task');
    console.log('3. Search tasks by title');
    console.log('4. Exit');
    rl.question('Enter your choice: ', function (choice) {
        switch (choice) {
            case '1':
                getAllTasks().then(startMenu);
                break;
            case '2':
                createTask().then(startMenu);
                break;
            case '3':
                searchTasksByTitle().then(startMenu);
                break;
            case '4':
                rl.close();
                break;
            default:
                console.log('Invalid choice. Please enter a number between 1 and 4.');
                startMenu();
                break;
        }
    });
}
// Start the interactive menu
startMenu();
