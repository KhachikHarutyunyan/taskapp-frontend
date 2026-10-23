import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

const NotFoundPage = () => {
    const navigate = useNavigate()

  return (
    <div className='flex justify-center items-center min-h-screen bg-background'>
      <Card className="text-center p-8 space-y-4">
        <CardContent className="flex flex-col items-center justify-center space-y-4">
            <h1 className="text-4xl font-bold accent_text">404</h1>
            <p className="text-muted-foreground">Page not found.</p>
            <Button onClick={() => navigate("/login")} className="accent_bg">Home</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFoundPage
