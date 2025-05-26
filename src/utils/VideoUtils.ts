export class VideoUtils {
  static getYouTubeVideoId(url: string): string | null {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  static getYouTubeThumbnail(url: string): string {
    const id = this.getYouTubeVideoId(url);
    return id
      ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
      : "https://via.placeholder.com/320x180?text=Sem+Thumbnail";
  }

  static getYouTubeEmbedUrl(url: string): string {
    const id = this.getYouTubeVideoId(url);
    return id ? `https://www.youtube.com/embed/${id}` : "";
  }
}
