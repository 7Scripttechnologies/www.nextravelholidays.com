"use client";

import { useActionState, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { DestinationCategory, Highlight, ItineraryDay } from "@/data/destinations";
import { destinationCategories } from "@/data/destinations";
import type { ActionState } from "@/app/admin/actions";
import type { PackageRecord } from "@/lib/packages-db";
import { slugify } from "@/lib/utils";
import ImageField from "@/components/admin/ImageField";
import Button from "@/components/Button";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-line bg-black px-4 py-3 text-sm text-[#EDEDED] outline-none placeholder:text-muted/70 focus:border-[#E20E17]";

const defaultIncluded = [
  "Local guide",
  "Accommodation options",
  "Transportation",
  "Entrance tickets",
];

const defaultNotIncluded = [
  "Flights",
  "Personal expenses",
  "Travel insurance",
  "Meals not mentioned in the itinerary",
];

interface PackageFormProps {
  mode: "create" | "edit";
  initial?: PackageRecord;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}

export default function PackageForm({ mode, initial, action }: PackageFormProps) {
  const [state, formAction, pending] = useActionState(action, null);
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [image, setImage] = useState(initial?.image ?? "");
  const [gallery, setGallery] = useState<string[]>(initial?.gallery ?? []);
  const [highlights, setHighlights] = useState<Highlight[]>(
    initial?.highlights?.length ? initial.highlights : [{ title: "", image: "" }],
  );
  const [itinerary, setItinerary] = useState<(ItineraryDay & { activitiesText: string })[]>(
    (initial?.itinerary?.length
      ? initial.itinerary
      : [{ day: 1, title: "", summary: "", activities: [] }]
    ).map((day) => ({ ...day, activitiesText: day.activities.join("\n") })),
  );

  const galleryJson = useMemo(() => JSON.stringify(gallery.filter(Boolean)), [gallery]);
  const highlightsJson = useMemo(() => JSON.stringify(highlights), [highlights]);
  const itineraryJson = useMemo(
    () =>
      JSON.stringify(
        itinerary.map((day, index) => ({
          day: day.day || index + 1,
          title: day.title,
          summary: day.summary,
          activities: day.activitiesText
            .split(/\r?\n/)
            .map((item) => item.trim())
            .filter(Boolean),
        })),
      ),
    [itinerary],
  );

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="gallery" value={galleryJson} />
      <input type="hidden" name="highlights" value={highlightsJson} />
      <input type="hidden" name="itinerary" value={itineraryJson} />

      {state?.error ? (
        <p className="rounded-2xl border border-[#E20E17]/40 bg-[#E20E17]/10 px-4 py-3 text-sm text-[#EDEDED]">
          {state.error}
        </p>
      ) : null}

      <section className="rounded-[24px] border border-white/8 bg-[#141414] p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-[#EDEDED]">Card details</h2>
        <p className="mt-1 text-sm text-muted">These fields appear on destination cards and the package hero.</p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="text-sm font-medium text-[#EDEDED]">Package title</span>
            <input
              name="name"
              value={name}
              required
              onChange={(event) => {
                const nextName = event.target.value;
                setName(nextName);
                if (!slugTouched) setSlug(slugify(nextName));
              }}
              placeholder="Udaipur – Mount Abu"
              className={fieldClass}
            />
          </label>
          <label>
            <span className="text-sm font-medium text-[#EDEDED]">URL slug</span>
            <input
              name="slug"
              value={slug}
              required
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              placeholder="udaipur-mount-abu"
              className={fieldClass}
            />
          </label>
          <label>
            <span className="text-sm font-medium text-[#EDEDED]">Category</span>
            <select
              name="category"
              defaultValue={initial?.category ?? "City"}
              className={fieldClass}
            >
              {destinationCategories.map((category: DestinationCategory) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="md:col-span-2">
            <span className="text-sm font-medium text-[#EDEDED]">Short description</span>
            <textarea
              name="description"
              required
              rows={3}
              defaultValue={initial?.description ?? ""}
              placeholder="Lake palaces in Udaipur and cool hill air in Mount Abu..."
              className={`${fieldClass} resize-y`}
            />
          </label>
          <label>
            <span className="text-sm font-medium text-[#EDEDED]">Location</span>
            <input
              name="location"
              required
              defaultValue={initial?.location ?? ""}
              placeholder="Rajasthan, India"
              className={fieldClass}
            />
          </label>
          <label>
            <span className="text-sm font-medium text-[#EDEDED]">Duration</span>
            <input
              name="duration"
              required
              defaultValue={initial?.duration ?? ""}
              placeholder="3 Days / 2 Nights"
              className={fieldClass}
            />
          </label>
          <label>
            <span className="text-sm font-medium text-[#EDEDED]">Price</span>
            <input
              name="price"
              required
              defaultValue={initial?.price ?? ""}
              placeholder="₹7,000"
              className={fieldClass}
            />
          </label>
          <label>
            <span className="text-sm font-medium text-[#EDEDED]">Rating</span>
            <input
              name="rating"
              type="number"
              min={0}
              max={5}
              step={0.1}
              defaultValue={initial?.rating ?? 4.8}
              className={fieldClass}
            />
          </label>
          <label>
            <span className="text-sm font-medium text-[#EDEDED]">Sort order</span>
            <input
              name="sortOrder"
              type="number"
              defaultValue={initial?.sortOrder ?? 0}
              className={fieldClass}
            />
          </label>
          <label className="flex items-center gap-3 pt-6 text-sm text-[#EDEDED]">
            <input
              name="active"
              type="checkbox"
              defaultChecked={initial?.active !== false}
              className="size-4 accent-[#E20E17]"
            />
            Active (visible on website)
          </label>
          <label className="flex items-center gap-3 pt-6 text-sm text-[#EDEDED]">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={initial?.featured !== false}
              className="size-4 accent-[#E20E17]"
            />
            Show in homepage “Explore top destination”
          </label>
        </div>

        <div className="mt-5">
          <ImageField label="Cover image" value={image} onChange={setImage} required />
          <input type="hidden" name="image" value={image} />
        </div>
      </section>

      <section className="rounded-[24px] border border-white/8 bg-[#141414] p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-[#EDEDED]">Overview</h2>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-[#EDEDED]">Full overview</span>
          <textarea
            name="overview"
            required
            rows={5}
            defaultValue={initial?.overview ?? ""}
            className={`${fieldClass} resize-y`}
          />
        </label>
      </section>

      <section className="rounded-[24px] border border-white/8 bg-[#141414] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-[#EDEDED]">Gallery</h2>
          <button
            type="button"
            onClick={() => setGallery((items) => [...items, ""])}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#E20E17]"
          >
            <Plus className="size-4" /> Add photo
          </button>
        </div>
        <div className="mt-4 space-y-5">
          {gallery.map((item, index) => (
            <div key={`gallery-${index}`} className="rounded-2xl border border-white/8 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-muted">Photo {index + 1}</p>
                <button
                  type="button"
                  onClick={() => setGallery((items) => items.filter((_, itemIndex) => itemIndex !== index))}
                  className="text-muted hover:text-[#E20E17]"
                  aria-label="Remove photo"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <ImageField
                label="Image"
                value={item}
                onChange={(value) =>
                  setGallery((items) => items.map((current, itemIndex) => (itemIndex === index ? value : current)))
                }
              />
            </div>
          ))}
          {gallery.length === 0 ? <p className="text-sm text-muted">Cover image will be used if no gallery photos are added.</p> : null}
        </div>
      </section>

      <section className="rounded-[24px] border border-white/8 bg-[#141414] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-[#EDEDED]">Experience highlights</h2>
          <button
            type="button"
            onClick={() => setHighlights((items) => [...items, { title: "", image: "" }])}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#E20E17]"
          >
            <Plus className="size-4" /> Add highlight
          </button>
        </div>
        <div className="mt-4 space-y-5">
          {highlights.map((item, index) => (
            <div key={`highlight-${index}`} className="rounded-2xl border border-white/8 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-muted">Highlight {index + 1}</p>
                <button
                  type="button"
                  onClick={() => setHighlights((items) => items.filter((_, itemIndex) => itemIndex !== index))}
                  className="text-muted hover:text-[#E20E17]"
                  aria-label="Remove highlight"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-[#EDEDED]">Title</span>
                <input
                  value={item.title}
                  onChange={(event) =>
                    setHighlights((items) =>
                      items.map((current, itemIndex) =>
                        itemIndex === index ? { ...current, title: event.target.value } : current,
                      ),
                    )
                  }
                  placeholder="Boat ride on Lake Pichola"
                  className={fieldClass}
                />
              </label>
              <div className="mt-4">
                <ImageField
                  label="Thumbnail"
                  value={item.image}
                  onChange={(value) =>
                    setHighlights((items) =>
                      items.map((current, itemIndex) =>
                        itemIndex === index ? { ...current, image: value } : current,
                      ),
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-white/8 bg-[#141414] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold text-[#EDEDED]">Itinerary</h2>
          <button
            type="button"
            onClick={() =>
              setItinerary((items) => [
                ...items,
                { day: items.length + 1, title: "", summary: "", activities: [], activitiesText: "" },
              ])
            }
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#E20E17]"
          >
            <Plus className="size-4" /> Add day
          </button>
        </div>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-[#EDEDED]">Itinerary intro</span>
          <textarea
            name="itineraryIntro"
            rows={2}
            defaultValue={
              initial?.itineraryIntro ??
              "Take a look at this example travel flow to understand the pace and experiences included in this trip."
            }
            className={`${fieldClass} resize-y`}
          />
        </label>
        <div className="mt-4 space-y-5">
          {itinerary.map((day, index) => (
            <div key={`day-${index}`} className="rounded-2xl border border-white/8 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-muted">Day {index + 1}</p>
                <button
                  type="button"
                  onClick={() => setItinerary((items) => items.filter((_, itemIndex) => itemIndex !== index))}
                  className="text-muted hover:text-[#E20E17]"
                  aria-label="Remove day"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-[100px_1fr]">
                <label>
                  <span className="text-sm font-medium text-[#EDEDED]">Day</span>
                  <input
                    type="number"
                    min={1}
                    value={day.day}
                    onChange={(event) =>
                      setItinerary((items) =>
                        items.map((current, itemIndex) =>
                          itemIndex === index ? { ...current, day: Number(event.target.value) } : current,
                        ),
                      )
                    }
                    className={fieldClass}
                  />
                </label>
                <label>
                  <span className="text-sm font-medium text-[#EDEDED]">Title</span>
                  <input
                    value={day.title}
                    onChange={(event) =>
                      setItinerary((items) =>
                        items.map((current, itemIndex) =>
                          itemIndex === index ? { ...current, title: event.target.value } : current,
                        ),
                      )
                    }
                    placeholder="Arrival & First Impressions"
                    className={fieldClass}
                  />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="text-sm font-medium text-[#EDEDED]">Summary</span>
                <textarea
                  rows={2}
                  value={day.summary}
                  onChange={(event) =>
                    setItinerary((items) =>
                      items.map((current, itemIndex) =>
                        itemIndex === index ? { ...current, summary: event.target.value } : current,
                      ),
                    )
                  }
                  className={`${fieldClass} resize-y`}
                />
              </label>
              <label className="mt-4 block">
                <span className="text-sm font-medium text-[#EDEDED]">Activities (one per line)</span>
                <textarea
                  rows={4}
                  value={day.activitiesText}
                  onChange={(event) =>
                    setItinerary((items) =>
                      items.map((current, itemIndex) =>
                        itemIndex === index ? { ...current, activitiesText: event.target.value } : current,
                      ),
                    )
                  }
                  placeholder={"Arrival and hotel check-in\nCity Palace visit"}
                  className={`${fieldClass} resize-y`}
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-white/8 bg-[#141414] p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-[#EDEDED]">What’s included</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label>
            <span className="text-sm font-medium text-[#EDEDED]">Included (one per line)</span>
            <textarea
              name="included"
              rows={6}
              defaultValue={(initial?.included?.length ? initial.included : defaultIncluded).join("\n")}
              className={`${fieldClass} resize-y`}
            />
          </label>
          <label>
            <span className="text-sm font-medium text-[#EDEDED]">Not included (one per line)</span>
            <textarea
              name="notIncluded"
              rows={6}
              defaultValue={(initial?.notIncluded?.length ? initial.notIncluded : defaultNotIncluded).join("\n")}
              className={`${fieldClass} resize-y`}
            />
          </label>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : mode === "create" ? "Create package" : "Save changes"}
        </Button>
        <Button href="/admin" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
