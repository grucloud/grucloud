#!/usr/bin/env node

import { handler } from "../app.js";
const event = process.env;
handler(event);
