'use client'

import { useState, useRef, useEffect } from 'react'
import { Heart, Music, Volume2, VolumeX, Phone, MessageCircle, MapPin, Calendar, Clock, Share2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function WeddingInvitation() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [petals, setPetals] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([])
  const [guestBook, setGuestBook] = useState({ name: '', password: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Create falling petals with colors
    const colors = ['🌸', '🍃', '🌸', '🍃', '🌸']
    const petalArray = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setPetals(petalArray as any)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1 }
    )

    const sections = document.querySelectorAll('[data-animate]')
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [isMounted])

  useEffect(() => {
    setIsMounted(true)
    fetchMessages()

    // Autoplay music when page loads
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch((error) => {
        console.log('Autoplay prevented:', error)
        // Autoplay was prevented, user will need to click the button
      })
    }
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('invitation')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const copyToClipboard = async (accountNumber: string, name: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber)
      alert(`${name} 계좌번호가 복사되었습니다.`)
    } catch (err) {
      alert('복사에 실패했습니다.')
    }
  }

  const handleGuestBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!guestBook.name || !guestBook.message) {
      alert('이름과 메시지를 입력해주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('invitation')
        .insert([
          {
            name: guestBook.name,
            message: guestBook.message,
            password: guestBook.password || null
          }
        ])

      if (error) throw error

      alert('축하 메시지가 등록되었습니다!')
      setGuestBook({ name: '', password: '', message: '' })
      fetchMessages() // Refresh messages after submission
    } catch (error) {
      console.error('Error submitting message:', error)
      alert('메시지 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '임진석♥신해숙 결혼합니다',
          text: '2025년 11월 16일 일요일 오후 1시',
          url: window.location.href
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-white to-[#FAF8F5] relative overflow-hidden">
      {/* Background Music */}
      {isMounted && (
        <>
          <audio ref={audioRef} loop autoPlay>
            <source src="https://www.bensound.com/bensound-music/bensound-romantic.mp3" type="audio/mpeg" />
          </audio>

          {/* Music Control Button */}
          <button
            onClick={toggleMusic}
            className="fixed top-6 right-6 z-50 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
            aria-label="음악 재생/정지"
          >
            {isPlaying ? (
              <Volume2 className="w-5 h-5 text-[#D4AF37]" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </>
      )}

      {/* Falling Petals */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {petals.map((petal: any) => (
          <div
            key={petal.id}
            className="absolute animate-fall"
            style={{
              left: `${petal.left}%`,
              animationDelay: `${petal.delay}s`,
              animationDuration: `${petal.duration}s`
            }}
          >
            <span className="text-base opacity-60">{petal.color}</span>
          </div>
        ))}
      </div>
      {/* Hero and Gallery Section - Side by Side */}
      <section className="relative min-h-screen w-full flex flex-col md:flex-row">
        {/* Hero Photo - Left Side */}
        <div className="relative w-full md:w-1/2 h-screen">
          <img
            src="/images/hero.png"
            alt="임진석♥신해숙"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gallery - Right Side */}
        <div className="w-full md:w-1/2 bg-white/50 py-16 px-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-serif text-center text-[#D4AF37] mb-8">Gallery</h2>

            {/* Vertical layout */}
            <div className="flex flex-col gap-2">
              {/* First row: 1, 2 - same height */}
              <div className="flex gap-2 items-start">
                <div className="flex-1 overflow-hidden">
                  <img
                    src="/images/1.png"
                    alt="Wedding Photo 1"
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <img
                    src="/images/13.png"
                    alt="Wedding Photo 13"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Remaining photos in 2 columns */}
              <div className="flex gap-2">
                {/* Left column: 3, 5, 7, 9 */}
                <div className="flex-1 flex flex-col gap-2">
                  {[3, 5, 7, 9].map((i) => (
                    <div key={i} className="overflow-hidden">
                      <img
                        src={`/images/${i}.png`}
                        alt={`Wedding Photo ${i}`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  ))}
                </div>

                {/* Right column: 4, 6, 8, 10 */}
                <div className="flex-1 flex flex-col gap-2">
                  {[4, 6, 8, 10].map((i) => (
                    <div key={i} className="overflow-hidden">
                      <img
                        src={`/images/${i}.png`}
                        alt={`Wedding Photo ${i}`}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Message */}
      <section id="intro" data-animate className={`py-16 px-6 text-center ${visibleSections.has('intro') ? 'visible' : ''}`}>
        {/* M Logo Image - Outside container to be larger */}
        <div className="mb-8 flex justify-center">
          <img
            src="/images/M.png"
            alt="M"
            className="w-full h-auto object-contain"
            style={{ maxWidth: '900px' }}
          />
        </div>

        <div className="max-w-2xl mx-auto">
          <p className="text-gray-700 text-base" style={{ lineHeight: '2', letterSpacing: '0.05em' }}>
            믿음으로 함께하고 사랑으로 하나되는<br />
            저희 약속의 자리에<br />
            소중한 분들을 모시고자 합니다.<br />
            <br />
            서로를 아끼고 감사하며<br />
            아름답게 살아가겠습니다.<br />
            <br />
            귀한 걸음으로 저희의 앞날을<br />
            함께 축복해 주시면<br />
            더 없는 기쁨으로 간직하겠습니다.
          </p>
        </div>
      </section>

      {/* Photo 4 */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <img
            src="/images/4.png"
            alt="Wedding Photo 4"
            className="w-full h-auto object-contain"
          />
        </div>
      </section>

      {/* Bride & Groom Names */}
      <section className="py-12 px-6 text-center bg-white/50">
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="text-gray-700 text-lg" style={{ letterSpacing: '0.05em' }}>
            * <span className="font-semibold">Groom</span> / 임진석
          </p>
          <p className="text-gray-700 text-lg" style={{ letterSpacing: '0.05em' }}>
            * <span className="font-semibold">Bride</span> / 신해숙
          </p>
        </div>
      </section>

      {/* Parents Info */}
      <section className="py-12 px-6">
        <div className="max-w-md mx-auto space-y-3 text-center">
          <p className="text-gray-700" style={{ letterSpacing: '0.05em' }}>
            故임봉원 · 박순옥 의 아들 진석
          </p>
          <p className="text-gray-700" style={{ letterSpacing: '0.05em' }}>
            故신동욱 · 김용길 의 딸 해숙
          </p>
        </div>
      </section>

      {/* Wedding Date & Venue */}
      <section className="py-16 px-6 text-center bg-[#FAF8F5]">
        <div className="max-w-md mx-auto space-y-4">
          <p className="text-gray-800 text-3xl font-semibold" style={{ letterSpacing: '0.1em' }}>11월 16일</p>
          <p className="text-gray-800 text-xl" style={{ letterSpacing: '0.1em' }}>일요일 오후 1:00</p>
          <div className="pt-4 space-y-2">
            <p className="text-gray-700 text-lg" style={{ letterSpacing: '0.05em' }}>영동 아모르아트웨딩컨벤션</p>
            <p className="text-gray-700 text-lg" style={{ letterSpacing: '0.05em' }}>2층 아모르홀</p>
          </div>
        </div>
      </section>

      {/* Photo 11 */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <img
            src="/images/11.png"
            alt="Wedding Photo 11"
            className="w-full h-auto object-contain"
          />
        </div>
      </section>

      {/* Photo 12 */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <img
            src="/images/12.png"
            alt="Wedding Photo 12"
            className="w-full h-auto object-contain"
          />
        </div>
      </section>

      {/* Contact Buttons */}
      <section id="contact" data-animate className={`py-8 px-6 ${visibleSections.has('contact') ? 'visible' : ''}`}>
        <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
          {/* Groom Contact */}
          <div>
            <p className="text-sm text-center text-gray-600 mb-2">신랑에게 연락하기</p>
            <div className="flex gap-2">
              <a
                href="tel:013-1333"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">전화</span>
              </a>
              <a
                href="sms:013-1333"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">문자</span>
              </a>
            </div>
          </div>

          {/* Bride Contact */}
          <div>
            <p className="text-sm text-center text-gray-600 mb-2">신부에게 연락하기</p>
            <div className="flex gap-2">
              <a
                href="tel:010-4587-5562"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">전화</span>
              </a>
              <a
                href="sms:010-4587-5562"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">문자</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Guest Book */}
      <section id="guestbook" data-animate className={`py-16 px-6 bg-[#FAFAF8] ${visibleSections.has('guestbook') ? 'visible' : ''}`}>
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-xl text-gray-600 mb-2" style={{ letterSpacing: '0.05em' }}>[Guest book]</h2>
          <p className="text-sm text-gray-400 mb-8">신랑 신부에게 소중한 축하메시지를 남겨주세요!</p>

          <form onSubmit={handleGuestBookSubmit} className="space-y-3">
            {/* Name and Password */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="이름"
                value={guestBook.name}
                onChange={(e) => setGuestBook({ ...guestBook, name: e.target.value })}
                className="px-4 py-2 bg-[#F0F0F0] border-0 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                style={{ fontSize: '15px' }}
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={guestBook.password}
                onChange={(e) => setGuestBook({ ...guestBook, password: e.target.value })}
                className="px-4 py-2 bg-[#F0F0F0] border-0 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                style={{ fontSize: '15px' }}
              />
            </div>

            {/* Message */}
            <textarea
              placeholder="메시지 (40자 이내로 등록)"
              rows={4}
              maxLength={40}
              value={guestBook.message}
              onChange={(e) => setGuestBook({ ...guestBook, message: e.target.value })}
              className="w-full px-4 py-4 bg-[#F0F0F0] border-0 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
              style={{ fontSize: '15px' }}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#6B7280] text-white font-medium hover:bg-[#5B6370] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontSize: '15px' }}
            >
              {isSubmitting ? '등록 중...' : '축하 메시지 등록'}
            </button>
          </form>

          {/* Messages Display */}
          {isMounted && (
            <div className="mt-12">
              <h3 className="text-lg text-gray-600 text-center mb-6">축하 메시지</h3>

              {isLoadingMessages ? (
                <p className="text-center text-gray-400">메시지를 불러오는 중...</p>
              ) : messages.length === 0 ? (
                <p className="text-center text-gray-400">첫 번째 축하 메시지를 남겨주세요!</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {messages.map((msg) => (
                    <div key={msg.id} className="bg-white rounded-lg p-4 shadow-sm text-left">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-700">{msg.name}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.created_at).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap text-left">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Account Info */}
      <section id="account" data-animate className={`py-16 px-6 bg-white/50 ${visibleSections.has('account') ? 'visible' : ''}`}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-serif text-center text-[#D4AF37] mb-8">마음 전하실 곳</h2>

          <div className="space-y-4">
            {/* Groom Account */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-3">신랑측 계좌번호</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">신랑 임진석</span>
                  <button
                    onClick={() => copyToClipboard('352-1494-2398-73', '신랑 임진석')}
                    className="text-sm text-[#D4AF37] hover:underline"
                  >
                    계좌번호 복사
                  </button>
                </div>
                <p className="text-sm text-gray-500">352-1494-2398-73</p>
              </div>
            </div>

            {/* Bride Account */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-3">신부측 계좌번호</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">신부 신해숙</span>
                  <button
                    onClick={() => copyToClipboard('453032-56-097057', '신부 신해숙')}
                    className="text-sm text-[#D4AF37] hover:underline"
                  >
                    계좌번호 복사
                  </button>
                </div>
                <p className="text-sm text-gray-500">453032-56-097057</p>
              </div>
            </div>

            {/* Flower Wreath Button */}
            <div className="pt-4">
              <a
                href="https://rainbow-f.kr/category/wedding"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 bg-[#D4AF37] text-white text-center font-medium rounded-xl hover:bg-[#C4A030] transition-colors shadow-sm"
              >
                축하화환 보내기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Info */}
      <section id="venue" data-animate className={`py-16 px-6 ${visibleSections.has('venue') ? 'visible' : ''}`}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-serif text-[#D4AF37] mb-8">오시는 길</h2>

          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
              <div className="text-left">
                <h3 className="font-semibold text-lg mb-2">영동 아모르아트웨딩컨벤션</h3>
                <p className="text-gray-600 text-sm mb-1">2층 아모르홀</p>
                <p className="text-gray-500 text-sm">
                  충청북도 영동군 영동읍 계산리<br />
                  (주소 상세 정보 추가)
                </p>
              </div>
            </div>

            {/* Google Map */}
            <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4">
              <iframe
                src="https://www.google.com/maps?q=영동+아모르아트웨딩컨벤션&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://map.kakao.com/link/search/영동 아모르아트웨딩컨벤션"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 bg-[#FEE500] text-[#3C1E1E] rounded-lg font-medium hover:bg-[#FFEB00] transition-colors text-center"
              >
                카카오맵
              </a>
              <a
                href="https://map.naver.com/v5/search/영동 아모르아트웨딩컨벤션"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 bg-[#03C75A] text-white rounded-lg font-medium hover:bg-[#02B350] transition-colors text-center"
              >
                네이버지도
              </a>
            </div>

            {/* Transportation Guide */}
            <div className="mt-8 text-left bg-white/50 rounded-xl p-6">
              <div className="space-y-6">
                {/* Bus */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">버스 이용시</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>
                      <p className="font-medium text-gray-700 mb-1">▶ 시외(고속)버스 이용 시 :</p>
                      <p className="pl-4" style={{ lineHeight: '1.6' }}>
                        각 지방터미널에서 영동시외버스 터미널행 이용<br />
                        → 영동터미널 하차 → 도보로 15분 이동 → 도착
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700 mb-1">▶ 기차 이용 시 :</p>
                      <p className="pl-4" style={{ lineHeight: '1.6' }}>
                        경부선 이용 → 영동역에서 하차 → 도보로 15분 이동 → 도착
                      </p>
                    </div>
                  </div>
                </div>

                {/* Car */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">승용차 이용시</h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>
                      <p className="font-medium text-gray-700 mb-1">▶ 고속도로 이용 시(경부고속도록 영동IC 진입)</p>
                      <p className="pl-4" style={{ lineHeight: '1.6' }}>
                        영동 톨게이트 통과 후 경부고속도로를 따라 11km 이동<br />
                        → 어미실삼거리에서 '군청, 어미실' 방면으로 좌회전<br />
                        → 기골로를 따라 1.99km 이동<br />
                        → '시내' 방면으로 우측 1시 방향으로 이동<br />
                        → 구교로를 따라 134m 이동 후 우회전<br />
                        → 계산로를 따라 154m 이동<br />
                        → '법원.검찰, 세무서.소방서, 군민운동장' 방면으로 좌회전<br />
                        → 계산로2길을 따라 546m 이동 후 11시 방향으로 이동<br />
                        → 영동황간로를 따라 702m 이동 → 도착
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center">
        <Heart className="w-8 h-8 mx-auto text-[#D4AF37] mb-4" />
        <p className="text-sm text-gray-500">
          Thank you for celebrating with us
        </p>
      </footer>
    </div>
  )
}
