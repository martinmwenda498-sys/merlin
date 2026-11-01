import { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Heart, 
  Download, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Image as ImageIcon,
  User,
  Calendar,
  Sparkles
} from 'lucide-react';
import { GalleryPhoto } from '../types/church';

interface GalleryViewProps {
  photos: GalleryPhoto[];
  onUploadPhoto: (photo: GalleryPhoto) => void;
  onLikePhoto: (id: string) => void;
}

export function GalleryView({ photos, onUploadPhoto, onLikePhoto }: GalleryViewProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Form states for photo upload
  const [title, setTitle] = useState('');
  const [album, setAlbum] = useState<GalleryPhoto['album']>('Sunday Worship');
  const [caption, setCaption] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const albums: Array<GalleryPhoto['album']> = [
    'Sunday Worship',
    'Youth Fellowship',
    'Missions & Outreach',
    'Baptisms & Dedications',
    'Sanctuary & Community',
  ];

  const filteredPhotos = photos.filter((p) => {
    if (selectedAlbum === 'all') return true;
    return p.album === selectedAlbum;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Image size is too large (max 8MB).');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setUploadError('Please provide a title for the gathering photo.');
      return;
    }
    if (!imagePreview) {
      setUploadError('Please choose a photo to upload.');
      return;
    }

    const newPhoto: GalleryPhoto = {
      id: `photo-${Date.now()}`,
      title: title.trim(),
      album: album,
      imageUrl: imagePreview,
      date: new Date().toISOString().split('T')[0],
      uploadedBy: uploadedBy.trim() || 'Church Member',
      uploaderRole: 'Member',
      approved: true,
      caption: caption.trim() || 'Shared with love from our church gathering.',
      likes: 1,
    };

    onUploadPhoto(newPhoto);
    setIsUploadModalOpen(false);

    // Reset
    setTitle('');
    setCaption('');
    setUploadedBy('');
    setImagePreview(null);
    setUploadError(null);
  };

  const activePhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  const handleNextPhoto = () => {
    if (activePhotoIndex !== null && activePhotoIndex < filteredPhotos.length - 1) {
      setActivePhotoIndex(activePhotoIndex + 1);
    } else {
      setActivePhotoIndex(0);
    }
  };

  const handlePrevPhoto = () => {
    if (activePhotoIndex !== null && activePhotoIndex > 0) {
      setActivePhotoIndex(activePhotoIndex - 1);
    } else {
      setActivePhotoIndex(filteredPhotos.length - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-stone-200 dark:border-stone-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-serif">
            Community Fellowship & Memories
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-900 dark:text-stone-100 mt-2 tracking-tight">
            Church Gatherings Gallery
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed">
            Moments of worship, fellowship, prayer, community benevolence, and sacred celebrations captured by our congregation and media team.
          </p>
        </div>

        {/* Upload Button */}
        <div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="py-3 px-5 rounded-xl bg-amber-800 hover:bg-amber-900 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-semibold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Camera className="w-4 h-4" />
            <span>Upload Gathering Photos</span>
          </button>
        </div>
      </div>

      {/* Album Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs scrollbar-none">
        <button
          onClick={() => setSelectedAlbum('all')}
          className={`py-2 px-4 rounded-lg font-medium whitespace-nowrap transition-colors ${
            selectedAlbum === 'all'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          All Gatherings ({photos.length})
        </button>
        {albums.map((cat) => {
          const count = photos.filter((p) => p.album === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedAlbum(cat)}
              className={`py-2 px-4 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedAlbum === cat
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Photos Masonry/Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="py-20 text-center bg-stone-100 dark:bg-stone-900 rounded-2xl border border-dashed border-stone-300 dark:border-stone-800 space-y-3">
          <ImageIcon className="w-12 h-12 mx-auto text-stone-400" />
          <h3 className="text-base font-medium text-stone-700 dark:text-stone-300">No photos in this album yet</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Be the first to share photos from this church gathering with our community.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-2 py-2 px-4 text-xs font-semibold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 rounded-lg hover:underline inline-flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              {/* Photo Frame with Fallback */}
              <div
                onClick={() => setActivePhotoIndex(index)}
                className="relative aspect-4/3 bg-stone-100 dark:bg-stone-800 overflow-hidden cursor-pointer"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Styled Fallback Container if image URL fails
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent && !parent.querySelector('.fallback-box')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'fallback-box absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-stone-100 to-amber-50 dark:from-stone-900 dark:to-stone-850 text-stone-400 text-center';
                      fallback.innerHTML = `<svg class="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><span class="text-xs font-serif italic">${photo.title}</span>`;
                      parent.appendChild(fallback);
                    }
                  }}
                />
                
                {/* Overlay Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-xs text-white/90 font-medium">Click to view fullscreen</span>
                </div>
              </div>

              {/* Photo Metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                    <span className="font-medium text-amber-700 dark:text-amber-400">{photo.album}</span>
                    <span aria-hidden="true">·</span>
                    <span>{photo.date}</span>
                  </div>
                  <h3 
                    onClick={() => setActivePhotoIndex(index)}
                    className="text-base font-serif font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {photo.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {photo.caption}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-500">
                  <span className="truncate max-w-[150px]">
                    By <span className="font-medium text-stone-700 dark:text-stone-300">{photo.uploadedBy}</span>
                  </span>
                  <button
                    onClick={() => onLikePhoto(photo.id)}
                    className="flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500/20 text-rose-500" />
                    <span className="font-mono tabular-nums">{photo.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Member Photo Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 my-8 text-stone-900 dark:text-stone-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-serif">
                  Church Community Photo Upload
                </span>
                <h3 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 mt-0.5">
                  Share Gathering Photos
                </h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitUpload} className="space-y-4 text-xs">
              {uploadError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-900/40">
                  {uploadError}
                </div>
              )}

              {/* File input / Preview area */}
              <div>
                <label className="block font-semibold mb-1.5 text-stone-800 dark:text-stone-200">
                  Choose Photo (from phone or computer) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl p-4 text-center hover:bg-stone-50 dark:hover:bg-stone-850 transition-colors relative">
                  {imagePreview ? (
                    <div className="relative aspect-video max-h-48 rounded-lg overflow-hidden mx-auto bg-stone-950">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute top-2 right-2 p-1 bg-stone-900/80 hover:bg-stone-900 text-white rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block py-4">
                      <Upload className="w-8 h-8 mx-auto text-amber-700 dark:text-amber-400 mb-2" />
                      <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 block">
                        Tap to select gathering photo
                      </span>
                      <span className="text-[11px] text-stone-500 mt-1 block">
                        Supports JPEG, PNG, WebP (up to 8MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-semibold mb-1 text-stone-800 dark:text-stone-200">
                  Photo Title / Event Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sunday Choir Ministration or Youth Camp Fellowship"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Album Selection */}
              <div>
                <label className="block font-semibold mb-1 text-stone-800 dark:text-stone-200">
                  Select Gathering Album
                </label>
                <select
                  value={album}
                  onChange={(e) => setAlbum(e.target.value as GalleryPhoto['album'])}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {albums.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Uploader Name */}
              <div>
                <label className="block font-semibold mb-1 text-stone-800 dark:text-stone-200">
                  Your Name / Ministry Unit
                </label>
                <input
                  type="text"
                  value={uploadedBy}
                  onChange={(e) => setUploadedBy(e.target.value)}
                  placeholder="e.g. Martin Mwenda (Youth Council)"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block font-semibold mb-1 text-stone-800 dark:text-stone-200">
                  Caption or Memory
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Share a brief memory or scripture related to this gathering..."
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 py-2.5 px-4 text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-amber-800 hover:bg-amber-900 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 rounded-lg transition-colors font-semibold shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Publish to Gallery</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-md p-4 sm:p-8">
          <button
            onClick={() => setActivePhotoIndex(null)}
            className="absolute top-5 right-5 p-2 text-stone-400 hover:text-white bg-stone-900/80 rounded-full transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevPhoto}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 text-stone-300 hover:text-white bg-stone-900/80 hover:bg-stone-800 rounded-full transition-colors z-40 hidden sm:block"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextPhoto}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 text-stone-300 hover:text-white bg-stone-900/80 hover:bg-stone-800 rounded-full transition-colors z-40 hidden sm:block"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl">
            {/* Image viewer */}
            <div className="md:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] sm:min-h-[420px]">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Sidebar info */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between text-stone-100 space-y-4 bg-stone-900">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-amber-400">
                  <span className="font-serif uppercase tracking-wider">{activePhoto.album}</span>
                  <span>·</span>
                  <span className="text-stone-400">{activePhoto.date}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-serif font-semibold text-stone-100">
                  {activePhoto.title}
                </h2>

                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {activePhoto.caption}
                </p>

                <div className="pt-3 border-t border-stone-800 text-xs text-stone-400 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-stone-500" />
                    <span>Uploaded by: <strong className="text-stone-200">{activePhoto.uploadedBy}</strong> ({activePhoto.uploaderRole})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    <span>Gathering Date: <strong className="text-stone-200">{activePhoto.date}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                <button
                  onClick={() => onLikePhoto(activePhoto.id)}
                  className="py-2 px-3 bg-stone-800 hover:bg-stone-750 text-stone-200 rounded-lg text-xs flex items-center gap-2 transition-colors"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>Bless Photo ({activePhoto.likes})</span>
                </button>

                <a
                  href={activePhoto.imageUrl}
                  download={activePhoto.title}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 bg-stone-800 hover:bg-stone-750 text-stone-200 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
