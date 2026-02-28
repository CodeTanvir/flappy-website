import userIcon from "@/public/assets/images/user.png";
import Image from "next/image";
import { IoStar } from "react-icons/io5";
function ReviewList({ review }) {
  return (
    <div className="flex gap-5">
      <div className="w-[60px]">
        <Image
          src={review?.avatar?.url || userIcon.src}
          width={55}
          height={55}
          alt="user icon"
          className="rounded-lg"
        />
      </div>
      <div className="w-[calc(100%-100px)]">
        <div>
          <h4 className="text-xl font-semibold">{review?.title}</h4>
          <p className="flex gap-2 items-center">
            <span className="font-medium">{review?.reviewedBy}</span>-
            <span className="text-gray-500">
              {new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
                -Math.floor(
                  (Date.now() - new Date(review?.createdAt)) / (1000 * 60),
                ),
                "minute",
              )}
            </span>
            <span className="flex items-center text-xs gap-1">
              ({review.rating} <IoStar className="text-yellow-500 mb-1" />)
            </span>
          </p>
          <p className="mt-3 text-gray-600">{review?.review}</p>
        </div>
      </div>
    </div>
  );
}

export default ReviewList;
