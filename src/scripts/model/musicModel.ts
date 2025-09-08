import { CreateSongDto, SongFormData } from "../dto/musicDto.js";

export class MusicModel {
  url = "http://localhost:2828";

  async createMusic(songData: SongFormData) {
    if (songData.source_type === "URL") {
      const formData = new FormData();
      formData.append("file", songData.file!);
      formData.append("title", songData.title);
      formData.append("artist", songData.artist || "");
      const response = await fetch(`${this.url}/music`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },

        body: JSON.stringify({
          title: songData.title,
          artist: songData.artist,
          source_type: "URL",
          url: songData.url,
        } as CreateSongDto),
      });

      if (!response.ok) {
        throw new Error("error ");
      }

      return response.json();
    } else {
      const res = await fetch(`${this.url}/music`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
          "X-Title": songData.title,
          "X-Artist": songData.artist || "",
        },
        body: songData.file,
      });

      if (!res.ok) {
        throw new Error("error ");
      }

      return await res.json();
    }
  }

  getToken(): string {
    return localStorage.getItem("token") || "";
  }

  validateMusicData(data: SongFormData): {
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.title || data.title.trim() === "") {
      errors.push("Title is required");
    }

    if (data.source_type === "UPLOAD") {
      if (!data.file) {
        errors.push("Audio file is required when uploading");
      } else if (!this.isValidAudioFile(data.file)) {
        errors.push("Please select a valid audio file (mp3, wav, ogg, aac)");
      }
    }

    return {
      errors,
    };
  }

  isValidAudioFile(file: File): boolean {
    const validTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/aac",
      "audio/mp3",
    ];
    return validTypes.includes(file.type);
  }
}
