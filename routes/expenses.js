"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var express = require("express");
var expenses_1 = require("../data/expenses");
var router = express.Router();
router.get('/', function (req, res) {
    var limit = +(req.query.limit) || 25;
    var offset = +(req.query.offset) || 0;
    res.send({
        expenses: expenses_1.expenses
            .sort(function (a, b) {
            var valA = Date.parse(a.date);
            var valB = Date.parse(b.date);
            if (valA > valB) {
                return -1;
            }
            if (valB > valA) {
                return 1;
            }
            return 0;
        })
            .slice(offset, offset + limit)
            .map(function (expense, index) {
            return __assign(__assign({}, expense), { index: offset + index });
        }),
        total: expenses_1.expenses.length
    });
});
router.get('/:id', function (req, res) {
    var expense = expenses_1.expenses.find(function (expense) { return expense.id === req.params.id; });
    if (expense) {
        res.send(expense);
    }
    else {
        res.status(404);
    }
});
router.post('/:id', function (req, res) {
    var expense = expenses_1.expenses.find(function (expense) { return expense.id === req.params.id; });
    if (expense) {
        expense.comment = req.body.comment || expense.comment;
        res.status(200).send(expense);
    }
    else {
        res.status(404);
    }
});
router.post('/:id/receipts', function (req, res) {
    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }
    var id = req.params.id;
    var expense = expenses_1.expenses.find(function (expense) { return expense.id === id; });
    if (expense) {
        var receipt = req.files.receipt;
        var receiptId_1 = id + "-" + expense.receipts.length;
        receipt.mv(process.cwd() + "/receipts/" + receiptId_1, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
            expense.receipts.push({
                url: "/receipts/" + receiptId_1
            });
            res.status(200).send(expense);
        });
    }
    else {
        res.status(404);
    }
});
exports["default"] = router;
