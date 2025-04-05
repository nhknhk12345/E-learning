import HeroCarousel from "@/components/HeroCarousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, GraduationCap, Clock, HeadphonesIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full">
        <HeroCarousel />
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Khóa học nổi bật</h2>
          {/* TODO: Add featured courses grid */}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 md:px-8 bg-muted/50">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tại sao chọn chúng tôi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Chất lượng hàng đầu
              </h3>
              <p className="text-muted-foreground">
                Nội dung được biên soạn kỹ lưỡng bởi các chuyên gia
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Học mọi lúc mọi nơi
              </h3>
              <p className="text-muted-foreground">
                Truy cập khóa học từ mọi thiết bị, mọi thời điểm
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <HeadphonesIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-muted-foreground">
                Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng bắt đầu hành trình học tập?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Đăng ký ngay hôm nay để trải nghiệm các khóa học chất lượng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/courses">
                Xem khóa học
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/register">Đăng ký ngay</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
