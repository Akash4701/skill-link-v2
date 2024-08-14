"use client"
import { useParams } from 'next/navigation';
import PartiPost from '@/components/Post';

function PostPage() {
    const params = useParams();
    const { postId } = params;  // Extract the `id` from the parameters
  
    return (
        <div>
            {postId && <PartiPost id={postId} />}  {/* Conditionally render PartiPost only if `id` is available */}
        </div>
    );
}
export default PostPage