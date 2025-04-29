import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="text-2xl font-bold text-indigo-600">SplitSplit</span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            <a href="#features" className="text-sm font-semibold leading-6 text-gray-900">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-semibold leading-6 text-gray-900">
              How it works
            </a>
            <a href="#testimonials" className="text-sm font-semibold leading-6 text-gray-900">
              Testimonials
            </a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link href="/dashboard" className="text-sm font-semibold leading-6 text-gray-900">
              Get Started <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Split expenses with friends, simplified
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              SplitSplit makes it easy to share expenses with friends and family. Track bills, split costs, and settle up without the hassle.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/dashboard"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Get started
              </Link>
              <a href="#how-it-works" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      {/* Features section */}
      <div id="features" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Split Expenses Easily</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage shared expenses
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              SplitSplit simplifies the process of tracking, splitting, and settling expenses with friends, roommates, and travel companions.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.5h.01M12 18h.01M15 18h.01M12 6a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </div>
                  Create and manage groups
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Organize expenses by creating groups for roommates, trips, events, or any shared expense situation.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.8 9a2 2 0 00-1.8-1h-2a2 2 0 00-2 2v.5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 13h2m4 0h2" />
                    </svg>
                  </div>
                  Track expenses easily
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Add expenses on the go, categorize them, and split them equally or with custom amounts.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  Smart debt simplification
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Our algorithm minimizes the number of transactions needed to settle debts within your group.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  Secure and private
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Your financial data is protected with industry-standard security measures.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div id="how-it-works" className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">How It Works</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple steps to manage shared expenses
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              SplitSplit takes the hassle out of splitting bills and tracking who owes what.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">Create a group</h3>
                <p className="mt-2 text-base text-gray-600 text-center">
                  Start by creating a group for your roommates, trip, or event and add members.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">Add expenses</h3>
                <p className="mt-2 text-base text-gray-600 text-center">
                  Record expenses as they happen, specifying who paid and how to split the cost.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white text-2xl font-bold">
                  3
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">Settle up</h3>
                <p className="mt-2 text-base text-gray-600 text-center">
                  See who owes what and settle debts with minimal transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials section */}
      <div id="testimonials" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What our users are saying
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col bg-white p-6 shadow-lg ring-1 ring-gray-200 rounded-lg">
              <div className="flex items-center gap-x-4">
                <img src="https://i.pravatar.cc/150?img=11" alt="" className="h-12 w-12 rounded-full" />
                <div>
                  <p className="text-sm font-semibold leading-6 text-gray-900">Sarah Johnson</p>
                  <p className="text-sm leading-6 text-gray-500">Roommate</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700">
                "SplitSplit has made managing apartment expenses with my roommates so much easier. No more awkward money conversations!"
              </p>
            </div>
            <div className="flex flex-col bg-white p-6 shadow-lg ring-1 ring-gray-200 rounded-lg">
              <div className="flex items-center gap-x-4">
                <img src="https://i.pravatar.cc/150?img=12" alt="" className="h-12 w-12 rounded-full" />
                <div>
                  <p className="text-sm font-semibold leading-6 text-gray-900">Michael Chen</p>
                  <p className="text-sm leading-6 text-gray-500">Frequent Traveler</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700">
                "I used SplitSplit on my last group vacation and it was a game-changer. We could all see expenses in real-time and settling up was a breeze."
              </p>
            </div>
            <div className="flex flex-col bg-white p-6 shadow-lg ring-1 ring-gray-200 rounded-lg">
              <div className="flex items-center gap-x-4">
                <img src="https://i.pravatar.cc/150?img=13" alt="" className="h-12 w-12 rounded-full" />
                <div>
                  <p className="text-sm font-semibold leading-6 text-gray-900">Emma Rodriguez</p>
                  <p className="text-sm leading-6 text-gray-500">Event Planner</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700">
                "Planning group events is part of my job, and SplitSplit has become my go-to tool for managing shared expenses. The debt simplification feature is brilliant!"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to simplify your shared expenses?
                <br />
                Start using SplitSplit today.
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Join thousands of users who are already enjoying stress-free expense sharing with SplitSplit.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Link
                  href="/dashboard"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get started
                </Link>
                <Link href="/dashboard" className="text-sm font-semibold leading-6 text-white">
                  Try it now <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="relative mt-16 h-80 lg:mt-8">
              <img
                className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
                alt="App screenshot"
                width={1824}
                height={1080}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; 2025 SplitSplit, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
