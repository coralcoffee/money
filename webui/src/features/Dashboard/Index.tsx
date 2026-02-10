const Dashboard = () => (
  <div className="grid w-full grid-cols-12 gap-6 px-6">
    <div className="col-span-12 rounded-2xl bg-[#f4f8fd] p-8 md:col-span-10">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-3xl font-extrabold text-neutral-800">
          We&#39;re glad you&#39;re here.
        </span>
        <div className="flex space-x-4">
          <button className="flex items-center rounded-full border border-neutral-200 bg-white px-4 py-2 font-semibold text-neutral-700 shadow-sm hover:bg-neutral-100">
            <svg
              className="mr-2"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <rect width="20" height="20" rx="4" fill="#F4F8FD" />
              <path
                d="M6 10h8M10 6v8"
                stroke="#0A0A0A"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            My Dashboard
          </button>
          <button className="flex items-center rounded-full border border-neutral-200 bg-white px-4 py-2 font-semibold text-neutral-700 shadow-sm hover:bg-neutral-100">
            <svg
              className="mr-2"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <rect width="20" height="20" rx="4" fill="#F4F8FD" />
              <path d="M6 6h8v8H6V6z" stroke="#0A0A0A" strokeWidth="2" />
            </svg>
            My Documents
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex flex-1 flex-col justify-center rounded-2xl bg-[#ffe29c] p-8">
          <h1 className="mb-4 text-4xl font-extrabold text-neutral-800">
            Easily publish your resume &amp; share it with anyone!
          </h1>
          <p className="mb-6 text-lg text-neutral-700">
            A quick and easy way to showcase your skills and collect valuable
            feedback.
          </p>
          <button className="mt-2 flex w-fit items-center rounded-xl bg-neutral-900 px-6 py-3 font-semibold text-white shadow hover:bg-neutral-800">
            Publish my resume
            <span className="ml-2">&rarr;</span>
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <img
            src="/assets/dashboard-illustration.png"
            alt="Dashboard Illustration"
            className="h-auto max-w-full rounded-2xl"
          />
        </div>
      </div>
    </div>
    <div className="col-span-12 rounded-lg bg-neutral-50 p-6 shadow md:col-span-2">
      {/* Right page content goes here */}
      <h2 className="mb-2 text-lg font-semibold">Next Steps</h2>
    </div>
  </div>
);

export default Dashboard;
