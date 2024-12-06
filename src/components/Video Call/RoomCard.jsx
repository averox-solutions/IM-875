import React from "react";

const RoomCard = () => {
  return (
    <div
      style={{
        width: "25%",
        border: "1px solid #e5e5e5",
        borderRadius: "30px",
        display: "flex",
        flexDirection: "Column",
        paddingLeft: "20px",
        background:
          "linear-gradient(to right, rgb(252, 252, 252), rgb(239, 254, 247))",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          style={{ width: "50px", height: "50px" }}
          src="../../../Images/iconRoom.png"
          alt="Room Image"
        />
        <div style={{ paddingTop: "20px" }}>
          <div style={{ fontWeight: "bold" }}>Ahmer</div>
          <span>Tuesday, December 3, 2024 at 2:36 PM</span>
        </div>
        <div>
          <svg
            className="bordertoprightradius: 30px"
            width="120px"
            height="14vh"
            bordertoprightradius="30px !important"
            style={{ borderTopRightRadius: "30px" }}
            viewBox="0 0 141 148"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_427_1017)">
              <path
                d="M71.5555 -29.7521C76.0158 -37.2343 84.7497 -41.0403 93.2668 -39.2134L162.838 -24.2899C171.516 -22.4285 177.98 -15.1499 178.805 -6.31346L185.337 63.6909C186.152 72.4261 181.268 80.6977 173.225 84.2024L107.516 112.837C99.4736 116.342 90.0897 114.288 84.2464 107.744L37.4181 55.2998C31.5071 48.68 30.5772 38.9893 35.1215 31.3662L71.5555 -29.7521Z"
                fill="white"
              />
            </g>
            <path
              d="M107.4 48.4514C109.068 46.9132 110.005 44.8269 110.005 42.6516C110.005 40.4762 109.068 38.39 107.399 36.8518C105.731 35.3136 103.468 34.4495 101.108 34.4496C98.7487 34.4496 96.4858 35.3138 94.8174 36.8521L93.9784 37.6253C93.8683 37.7268 93.7809 37.8474 93.7212 37.98C93.6616 38.1127 93.6309 38.255 93.6309 38.3986C93.6309 38.5422 93.6615 38.6844 93.7211 38.8171C93.7808 38.9498 93.8681 39.0704 93.9783 39.172L95.6556 40.7182C95.878 40.9233 96.1797 41.0385 96.4942 41.0385C96.8088 41.0386 97.1105 40.9234 97.333 40.7184L98.1722 39.945C98.9509 39.2272 100.007 38.8239 101.108 38.824C102.209 38.824 103.265 39.2273 104.044 39.9452C104.823 40.663 105.26 41.6366 105.26 42.6518C105.26 43.667 104.823 44.6406 104.044 45.3586L99.8496 49.2246C99.1147 49.8946 98.1365 50.2897 97.104 50.3335C96.0715 50.3772 95.0581 50.0667 94.2596 49.4617L93.3493 48.7608C93.2297 48.6687 93.0916 48.5992 92.9429 48.5563C92.7942 48.5135 92.6378 48.498 92.4826 48.5109C92.3274 48.5238 92.1765 48.5647 92.0385 48.6313C91.9004 48.698 91.778 48.7891 91.6782 48.8993L90.1579 50.5786C89.9563 50.8013 89.8589 51.0887 89.8871 51.3776C89.9154 51.6665 90.0669 51.9332 90.3084 52.1191L91.2188 52.8195C92.9196 54.1397 95.0972 54.8211 97.3183 54.7281C99.5394 54.6351 101.641 53.7744 103.205 52.3175L107.4 48.4514Z"
              fill="#4B882B"
            />
            <path
              d="M93.9791 56.1845C93.7567 55.9795 93.455 55.8643 93.1405 55.8642C92.8259 55.8642 92.5242 55.9794 92.3017 56.1844L91.4625 56.9578C90.6838 57.6756 89.6277 58.0788 88.5266 58.0788C87.4254 58.0788 86.3693 57.6755 85.5907 56.9576C84.812 56.2398 84.3746 55.2662 84.3745 54.251C84.3745 53.2358 84.8119 52.2621 85.5904 51.5442L89.7851 47.6782C90.5197 47.0077 91.498 46.6123 92.5306 46.5685C93.5633 46.5247 94.5768 46.8356 95.3751 47.4411L96.2854 48.142C96.405 48.2341 96.5431 48.3036 96.6918 48.3464C96.8405 48.3893 96.9969 48.4048 97.1521 48.3919C97.3073 48.379 97.4582 48.3381 97.5962 48.2714C97.7342 48.2048 97.8567 48.1137 97.9565 48.0034L99.4768 46.3241C99.6784 46.1014 99.7758 45.814 99.7475 45.5252C99.7193 45.2363 99.5677 44.9696 99.3262 44.7837L98.4159 44.0833C96.7151 42.763 94.5374 42.0815 92.3163 42.1745C90.0952 42.2676 87.9935 43.1282 86.4296 44.5853L82.2351 48.4514C80.5666 49.9896 79.6293 52.0759 79.6294 54.2512C79.6294 56.4266 80.5668 58.5128 82.2353 60.051C83.9039 61.5891 86.1668 62.4532 88.5264 62.4532C90.886 62.4531 93.1489 61.5889 94.8173 60.0507L95.6562 59.2775C95.7664 59.176 95.8538 59.0554 95.9135 58.9227C95.9731 58.79 96.0038 58.6478 96.0038 58.5042C96.0038 58.3606 95.9731 58.2183 95.9135 58.0856C95.8539 57.953 95.7665 57.8324 95.6564 57.7308L93.9791 56.1845Z"
              fill="#4B882B"
            />
            <path
              d="M80.0781 40.945L83.0859 42.1715C83.2284 42.2296 83.3819 42.2612 83.5376 42.2646C83.6933 42.268 83.8482 42.2431 83.9935 42.1912C84.1388 42.1394 84.2716 42.0617 84.3843 41.9626C84.497 41.8635 84.5874 41.7449 84.6504 41.6135C84.7134 41.4822 84.7477 41.3407 84.7513 41.1971C84.755 41.0536 84.728 40.9107 84.6718 40.7768C84.6156 40.6429 84.5313 40.5205 84.4238 40.4166C84.3162 40.3126 84.1876 40.2293 84.0451 40.1712L81.0372 38.9446C80.8947 38.8862 80.7411 38.8543 80.5852 38.8507C80.4293 38.8471 80.2741 38.8719 80.1286 38.9237C79.9831 38.9754 79.8501 39.0531 79.7372 39.1523C79.6243 39.2515 79.5337 39.3703 79.4707 39.5018C79.4076 39.6333 79.3733 39.775 79.3697 39.9187C79.3661 40.0625 79.3933 40.2055 79.4497 40.3395C79.5061 40.4736 79.5907 40.596 79.6985 40.6999C79.8063 40.8038 79.9353 40.8871 80.0781 40.945Z"
              fill="#4B882B"
            />
            <path
              d="M85.8362 38.5203C85.9634 38.7855 86.1997 38.9933 86.4931 39.098C86.7865 39.2026 87.113 39.1955 87.4007 39.0783C87.6884 38.961 87.9138 38.7432 88.0273 38.4727C88.1409 38.2022 88.1332 37.9012 88.006 37.636L86.6755 34.8629C86.6127 34.7313 86.5224 34.6124 86.4097 34.5129C86.297 34.4135 86.1642 34.3356 86.0188 34.2836C85.8734 34.2316 85.7183 34.2065 85.5624 34.2098C85.4065 34.2131 85.2528 34.2448 85.1101 34.3029C84.9675 34.361 84.8387 34.4445 84.7311 34.5486C84.6235 34.6527 84.5392 34.7753 84.4831 34.9095C84.4269 35.0436 84.4 35.1867 84.4039 35.3304C84.4078 35.4742 84.4424 35.6158 84.5058 35.7472L85.8362 38.5203Z"
              fill="#4B882B"
            />
            <path
              d="M109.533 55.6002L106.525 54.3736C106.237 54.257 105.911 54.2504 105.618 54.3552C105.325 54.46 105.089 54.6676 104.962 54.9325C104.835 55.1974 104.827 55.498 104.941 55.7682C105.054 56.0385 105.278 56.2563 105.566 56.374L108.573 57.6006C108.861 57.7178 109.188 57.7249 109.481 57.6203C109.774 57.5156 110.011 57.3078 110.138 57.0426C110.265 56.7773 110.273 56.4763 110.159 56.2058C110.046 55.9354 109.82 55.7175 109.533 55.6002Z"
              fill="#4B882B"
            />
            <path
              d="M103.774 58.0251C103.647 57.7604 103.411 57.5532 103.117 57.449C102.824 57.3447 102.498 57.3519 102.211 57.469C101.924 57.5862 101.698 57.8036 101.585 58.0736C101.471 58.3437 101.478 58.6442 101.605 58.9094L102.935 61.6824C102.998 61.8138 103.089 61.9324 103.201 62.0315C103.314 62.1306 103.447 62.2083 103.592 62.2601C103.737 62.3119 103.892 62.3369 104.048 62.3335C104.204 62.3301 104.357 62.2985 104.5 62.2404C104.642 62.1824 104.771 62.099 104.878 61.9951C104.986 61.8912 105.07 61.7688 105.126 61.6348C105.183 61.5009 105.21 61.3581 105.206 61.2145C105.202 61.071 105.168 60.9295 105.105 60.7981L103.774 58.0251Z"
              fill="#4B882B"
            />
            <defs>
              <filter
                id="filter0_d_427_1017"
                x="32.2559"
                y="-39.6665"
                width="153.169"
                height="164.354"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="10.1578" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_427_1017"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_427_1017"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <button
          style={{
            padding: "10px 50px",
            border: "none",
            background: "rgb(75, 136, 43)",
            color: "#fff",
            borderRadius: "10px",
          }}
        >
          Join
        </button>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="35px"
            viewBox="0 -960 960 960"
            width="35px"
            fill="#4B882B"
            // onClick={handleSettingsClick}
            style={{ cursor: "pointer" }}
          >
            <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
          </svg>
        </div>
      </div>


      
    </div>
  );
};

export default RoomCard;