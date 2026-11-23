# Wildlife case study distribution drafts

Status: FINAL DRAFT — do not publish externally without release approval.

All drafts use the same verified scope: a Sheraz-attributable engineering implementation for a single-camera wildlife detection workflow. They do not claim production deployment, accuracy, scale or measurable outcomes.

## Website case-study page

Proposed route: `/case-studies/wildlife-detection/`

Approved public title: **Single-Camera Wildlife Detection & Event Processing**

Proposed summary: “A single-camera workflow that connects RTSPS stream health, configurable YOLO detection, event deduplication, clip recording, storage and notification.”

Evidence framing: “Implementation evidence is inspectable; deployment is not claimed.”

Supporting material: the public technical architecture illustration embedded in the case-study page.

## GitHub profile README draft

### Single-Camera Wildlife Detection & Event Processing

An engineering implementation exploring real-time computer vision and event processing. Built with YOLO, FastAPI, Next.js, SQLite and Docker, the system connects camera-stream monitoring, object detection, event deduplication, recording, storage and notifications through a reviewable dashboard.

Engineering boundary: PTZ control, tracking, multi-camera operation, authentication, tenancy, billing, analytics and mobile apps are outside the reviewed scope. No production deployment or detection benchmark is claimed here.

Evidence: https://www.sherazdevsolutions.com/case-studies/wildlife-detection/ (public technical case study and architecture illustration).

## LinkedIn technical post draft

I built an engineering implementation exploring a single-camera wildlife detection workflow from the perspective of operational boundaries—not just model inference.

The useful engineering question is: what happens after a frame is classified?

The path is:

RTSPS stream → connection/reconnect health → YOLO detection and confidence filtering → event deduplication → SQLite metadata → MP4 recording → storage and email notification → FastAPI and Next.js review surfaces.

That separation matters because a detection is not automatically a reviewable event. The system needs bounded lifecycle behavior, an artifact, and a way for a human workflow to inspect what happened.

The implementation also makes its limits explicit: no PTZ, multi-camera operation, auth/tenancy, billing, analytics or mobile scope. I’m not claiming an accuracy, scale or production outcome without evidence.

Technical case study: https://www.sherazdevsolutions.com/case-studies/wildlife-detection/

## LinkedIn Featured section description

Technical case study: a Sheraz-attributable wildlife detection and event processing implementation connecting RTSPS camera health, YOLO inference, event deduplication, recording, storage, notifications and FastAPI/Next.js review surfaces. Includes architecture boundaries and explicit implementation limits. Production deployment, performance outcomes and commercial results are not claimed. Link: https://www.sherazdevsolutions.com/case-studies/wildlife-detection/.

## Consistency check

Each draft uses the same facts: single camera, RTSPS, YOLO, deduplication, recording, SQLite metadata, Google Drive, email, FastAPI, Next.js and documented non-goals. None uses a benchmark, commercial result, live URL or production claim.
