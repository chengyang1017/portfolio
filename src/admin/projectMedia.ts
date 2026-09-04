type UploadedProjectMedia = {
  id: string;
  url: string;
  size: number;
  contentType: string;
};

export async function uploadProjectScreenshot(file: File, slug: string): Promise<UploadedProjectMedia> {
  const response = await fetch(`/api/admin/project-media?slug=${encodeURIComponent(slug)}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': file.type,
      'X-File-Name': encodeURIComponent(file.name),
    },
    body: file,
  });

  const payload = (await response.json().catch(() => null)) as
    | (UploadedProjectMedia & { error?: string })
    | null;

  if (!response.ok || !payload?.url) {
    throw new Error(payload?.error || `Screenshot upload failed (${response.status}).`);
  }

  return payload;
}

export async function deleteProjectScreenshot(imageUrl: string) {
  const url = new URL(imageUrl, window.location.origin);
  const marker = '/api/media/';
  const markerIndex = url.pathname.indexOf(marker);
  if (markerIndex < 0) return;

  const id = decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
  if (!id) return;

  const response = await fetch(`/api/admin/project-media?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok && response.status !== 404) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error || `Screenshot delete failed (${response.status}).`);
  }
}
