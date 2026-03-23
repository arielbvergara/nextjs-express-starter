import { Request, Response } from "express";
import { googleAuth } from "../config/google";
import { config } from "../config";
import { CalendarService } from "../services/calendar";
import { cache } from "../lib/cache";
import { ApiResponse, CalendarEvent } from "../types";

export async function listEvents(
  req: Request,
  res: Response<ApiResponse>
): Promise<void> {
  try {
    const maxResults = parseInt(req.query.maxResults as string) || 10;
    const cacheKey = `calendar:events:${maxResults}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      res.json({ success: true, data: cached });
      return;
    }

    const calendarService = new CalendarService(googleAuth);
    const events = await calendarService.listEvents(maxResults, config.google.calendarId);

    cache.set(cacheKey, events);
    res.json({ success: true, data: events });
  } catch (error: any) {
    console.error("Calendar listEvents error:", error.message);
    res.status(500).json({ success: false, error: "Failed to fetch calendar events" });
  }
}

export async function createEvent(
  req: Request,
  res: Response<ApiResponse>
): Promise<void> {
  try {
    const event: CalendarEvent = req.body;

    if (!event.summary || !event.start?.dateTime || !event.end?.dateTime) {
      res.status(400).json({ success: false, error: "summary, start.dateTime, and end.dateTime are required" });
      return;
    }

    const calendarService = new CalendarService(googleAuth);
    const created = await calendarService.createEvent(event, config.google.calendarId);

    // Invalidate cached event lists so the next GET reflects the new event
    cache.invalidatePrefix("calendar:events:");

    res.status(201).json({ success: true, data: created, message: "Event created successfully" });
  } catch (error: any) {
    console.error("Calendar createEvent error:", error.message);
    res.status(500).json({ success: false, error: "Failed to create calendar event" });
  }
}
