import React from "react";
import type { Movie } from "../../types/types";

interface MovieStreamingInfoProps {
  movie?: Movie;
}

const MovieStreamingInfo: React.FC<MovieStreamingInfoProps> = ({ movie }) => {
  if (!movie || !movie.streamingInfo || !movie.streamingInfo.platforms) {
    return null;
  }

  const { flatrate, buy } = movie.streamingInfo.platforms;

  return (
    <div className="mt-4 p-3 bg-gray-800 rounded-lg">
      <h4 className="text-sm font-semibold text-white mb-2">Where to Watch</h4>

      {/* Streaming platforms (rent/buy) */}
      {buy && buy.length > 0 && (
        <div className="mb-2">
          <p className="text-xs text-gray-300 mb-1">Rent/Buy:</p>
          <div className="flex flex-wrap gap-1">
            {buy.slice(0, 3).map((provider, index) => (
              <span
                key={index}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                title={provider.provider_name}
              >
                {provider.provider_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Subscription platforms */}
      {flatrate && flatrate.length > 0 && (
        <div>
          <p className="text-xs text-gray-300 mb-1">Available on:</p>
          <div className="flex flex-wrap gap-1">
            {flatrate.slice(0, 3).map((provider, index) => (
              <span
                key={index}
                className="text-xs bg-green-600 text-white px-2 py-1 rounded"
                title={provider.provider_name}
              >
                {provider.provider_name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieStreamingInfo;
