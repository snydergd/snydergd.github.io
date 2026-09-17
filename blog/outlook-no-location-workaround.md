---
title: "Outlook Web - Office Hour Location - Set to \"No location\""
date: 2026-09-17 12:39:00
excerpt: "For whatever reason, Outlook web requires you to pick \"Remote\" or \"In Office\" in my case.  This is a workaround."
---

I haven't set myself as "Remote" or "In-Office" for my hours in outlook, and so it shows the hours as "No Location".  I like this, because it doesn't suggest something that is potentially false, since I don't update these settings at all, and it would be stuck, for a day-of-the-week on one of the two options, whether I am in office or not.

I was pretty annoyed to find out that there is no option for "No Location" in the selector, at least for me.

So, I found a way around it and wanted to share.

1. Go to Outlook Web in your browser and open devtools (F12)
2. Open Work hours (`Settings -> Calendar -> Work hours and location`)
3. Change the day you want to another option ("Remote" or "In Office")
4. In the dev tools network tab, right click the first "graphql" request that happened after your click, and copy as `curl (bash)`
5. Paste into notepad or a text editor of your choosing, to make edits.
6. In DevTools, get the "Segment ID" for the day you want, by running this in the console (note that you may need to enable pasting first).  Before running, replace "Friday" with the day of the week you want to change.
   
   ```javascript
   window.__satchelGlobalContext.rootStore.get("calendarWorkingHoursOption").initialWorkHourDefinitionsMap.get("Friday").map(x => x.id)[0]
   ```
7. Set the segment ID in your text editor in the body of the request, and replace "In Office" or "Remote" with "Unspecified" (the value for "No Location")
5. Open Git bash (or your preferred bash), and paste the text editor content and submit.

Reload Outlook web and you should be all set.
