"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createNote_1 = require("./createNote");
const deleteNote_1 = require("./deleteNote");
const getNoteById_1 = require("./getNoteById");
const listNotes_1 = require("./listNotes");
const updateNote_1 = require("./updateNote");
exports.handler = async (event) => {
    switch (event.info.fieldName) {
        case "getNoteById":
            return await getNoteById_1.default(event.arguments.noteId);
        case "createNote":
            return await createNote_1.default(event.arguments.note);
        case "listNotes":
            return await listNotes_1.default();
        case "deleteNote":
            return await deleteNote_1.default(event.arguments.noteId);
        case "updateNote":
            return await updateNote_1.default(event.arguments.note);
        default:
            return null;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBc0M7QUFDdEMsNkNBQXNDO0FBQ3RDLCtDQUF3QztBQUN4QywyQ0FBb0M7QUFDcEMsNkNBQXNDO0FBYXRDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxFQUFFLEtBQWtCLEVBQUUsRUFBRTtJQUMzQyxRQUFRLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQzFCLEtBQUssYUFBYTtZQUNkLE9BQU8sTUFBTSxxQkFBVyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckQsS0FBSyxZQUFZO1lBQ2IsT0FBTyxNQUFNLG9CQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsRCxLQUFLLFdBQVc7WUFDWixPQUFPLE1BQU0sbUJBQVMsRUFBRSxDQUFDO1FBQzdCLEtBQUssWUFBWTtZQUNiLE9BQU8sTUFBTSxvQkFBVSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEQsS0FBSyxZQUFZO1lBQ2IsT0FBTyxNQUFNLG9CQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsRDtZQUNJLE9BQU8sSUFBSSxDQUFDO0tBQ25CO0FBQ0wsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyZWF0ZU5vdGUgZnJvbSAnLi9jcmVhdGVOb3RlJztcbmltcG9ydCBkZWxldGVOb3RlIGZyb20gJy4vZGVsZXRlTm90ZSc7XG5pbXBvcnQgZ2V0Tm90ZUJ5SWQgZnJvbSAnLi9nZXROb3RlQnlJZCc7XG5pbXBvcnQgbGlzdE5vdGVzIGZyb20gJy4vbGlzdE5vdGVzJztcbmltcG9ydCB1cGRhdGVOb3RlIGZyb20gJy4vdXBkYXRlTm90ZSc7XG5pbXBvcnQgTm90ZSBmcm9tICcuL05vdGUnO1xuXG50eXBlIEFwcFN5bmNFdmVudCA9IHtcbiAgIGluZm86IHtcbiAgICAgZmllbGROYW1lOiBzdHJpbmdcbiAgfSxcbiAgIGFyZ3VtZW50czoge1xuICAgICBub3RlSWQ6IHN0cmluZyxcbiAgICAgbm90ZTogTm90ZVxuICB9XG59XG5cbmV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIChldmVudDpBcHBTeW5jRXZlbnQpID0+IHtcbiAgICBzd2l0Y2ggKGV2ZW50LmluZm8uZmllbGROYW1lKSB7XG4gICAgICAgIGNhc2UgXCJnZXROb3RlQnlJZFwiOlxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGdldE5vdGVCeUlkKGV2ZW50LmFyZ3VtZW50cy5ub3RlSWQpO1xuICAgICAgICBjYXNlIFwiY3JlYXRlTm90ZVwiOlxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGNyZWF0ZU5vdGUoZXZlbnQuYXJndW1lbnRzLm5vdGUpO1xuICAgICAgICBjYXNlIFwibGlzdE5vdGVzXCI6XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgbGlzdE5vdGVzKCk7XG4gICAgICAgIGNhc2UgXCJkZWxldGVOb3RlXCI6XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgZGVsZXRlTm90ZShldmVudC5hcmd1bWVudHMubm90ZUlkKTtcbiAgICAgICAgY2FzZSBcInVwZGF0ZU5vdGVcIjpcbiAgICAgICAgICAgIHJldHVybiBhd2FpdCB1cGRhdGVOb3RlKGV2ZW50LmFyZ3VtZW50cy5ub3RlKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn0iXX0=