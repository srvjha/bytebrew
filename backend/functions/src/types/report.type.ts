export interface Report {
  type: "traffic" | "power" | "cultural" | "accident";
  mediaUrl?: string;
  geo: { lat: number; lng: number };
  submittedAt: FirebaseFirestore.Timestamp;
  source: "twitter" | "user" | "sensor";
  rawText: string;
}
