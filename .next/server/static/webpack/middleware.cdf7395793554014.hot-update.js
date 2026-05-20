"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("middleware",{

/***/ "(middleware)/./middleware.ts":
/*!***********************!*\
  !*** ./middleware.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   middleware: () => (/* binding */ middleware)\n/* harmony export */ });\n/* harmony import */ var _lib_supabase_middleware__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/supabase/middleware */ \"(middleware)/./lib/supabase/middleware.ts\");\n/**\n * Root Next.js middleware — refreshes Supabase session and enforces route guards.\n *\n * Protected routes:\n *   /profile/*        → login required\n *   /admin/*          → login + ADMIN role\n *   /school/[courseId]/lesson/[lessonId] → login required\n */ \nasync function middleware(request) {\n    // updateSession already securely checks for /admin and validates the ADMIN role\n    const response = await (0,_lib_supabase_middleware__WEBPACK_IMPORTED_MODULE_0__.updateSession)(request);\n    return response;\n}\nconst config = {\n    matcher: [\n        \"/admin/:path*\",\n        \"/profile/:path*\",\n        \"/school/:path*/lesson/:path*\"\n    ]\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vbWlkZGxld2FyZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7OztDQU9DLEdBRXlEO0FBRW5ELGVBQWVDLFdBQVdDLE9BQW9CO0lBQ25ELGdGQUFnRjtJQUNoRixNQUFNQyxXQUFXLE1BQU1ILHVFQUFhQSxDQUFDRTtJQUNyQyxPQUFPQztBQUNUO0FBRU8sTUFBTUMsU0FBUztJQUNwQkMsU0FBUztRQUNQO1FBQ0E7UUFDQTtLQUNEO0FBQ0gsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9taWRkbGV3YXJlLnRzPzQyMmQiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSb290IE5leHQuanMgbWlkZGxld2FyZSDigJQgcmVmcmVzaGVzIFN1cGFiYXNlIHNlc3Npb24gYW5kIGVuZm9yY2VzIHJvdXRlIGd1YXJkcy5cbiAqXG4gKiBQcm90ZWN0ZWQgcm91dGVzOlxuICogICAvcHJvZmlsZS8qICAgICAgICDihpIgbG9naW4gcmVxdWlyZWRcbiAqICAgL2FkbWluLyogICAgICAgICAg4oaSIGxvZ2luICsgQURNSU4gcm9sZVxuICogICAvc2Nob29sL1tjb3Vyc2VJZF0vbGVzc29uL1tsZXNzb25JZF0g4oaSIGxvZ2luIHJlcXVpcmVkXG4gKi9cbmltcG9ydCB7IHR5cGUgTmV4dFJlcXVlc3QgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgeyB1cGRhdGVTZXNzaW9uIH0gZnJvbSAnQC9saWIvc3VwYWJhc2UvbWlkZGxld2FyZSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtaWRkbGV3YXJlKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XG4gIC8vIHVwZGF0ZVNlc3Npb24gYWxyZWFkeSBzZWN1cmVseSBjaGVja3MgZm9yIC9hZG1pbiBhbmQgdmFsaWRhdGVzIHRoZSBBRE1JTiByb2xlXG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdXBkYXRlU2Vzc2lvbihyZXF1ZXN0KTtcbiAgcmV0dXJuIHJlc3BvbnNlO1xufVxuXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xuICBtYXRjaGVyOiBbXG4gICAgJy9hZG1pbi86cGF0aConLFxuICAgICcvcHJvZmlsZS86cGF0aConLFxuICAgICcvc2Nob29sLzpwYXRoKi9sZXNzb24vOnBhdGgqJ1xuICBdLFxufTtcbiJdLCJuYW1lcyI6WyJ1cGRhdGVTZXNzaW9uIiwibWlkZGxld2FyZSIsInJlcXVlc3QiLCJyZXNwb25zZSIsImNvbmZpZyIsIm1hdGNoZXIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(middleware)/./middleware.ts\n");

/***/ })

});